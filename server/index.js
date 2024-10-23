const express = require('express')
const cors = require('cors')
const app = express()
const port = 3333

app.use(cors())
app.get('/api', (req, res) => {
  res.json({ message: 'hello from server' })
})

app.listen(port, () => {
  console.log(`ReBAC is listening on port ${port}`)
})