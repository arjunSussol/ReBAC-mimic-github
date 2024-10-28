const express = require('express')
const cors = require('cors')

const apiRouter = require('./api')
const config = require('./utils/config')

const app = express()
const port = config.PORT

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`ReBAC is listening on port ${port}`)
})