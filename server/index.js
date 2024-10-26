const express = require('express')
const cors = require('cors')

const { Permit } = require('permitio')
const config = require('./utils/config')

const permit = new Permit({
  token: config.PERMIT_API_KEY,
  pdp: config.PDP
})

const app = express()
const port = config.PORT

app.use(cors())
app.get('/api', async (req, res) => {
  const permitted = await permit.check(
    // user
    'jane@acme.com',
    // action
    'read',
    // resource
    {
      type: 'file',
      key: '2023_report',
    }
  )

  if (permitted) {
    res.status(200).send('jane@acme.com is permitted to view repository')
  } else {
    res.status(403).send('jane@acme.com is not permitted to view repository')
  }
})

app.listen(port, () => {
  console.log(`ReBAC is listening on port ${port}`)
})