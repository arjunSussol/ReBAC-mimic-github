const apiRouter = require('express').Router()
const { Permit } = require('permitio')
const config = require('./utils/config')

const permit = new Permit({
  token: config.PERMIT_API_KEY,
  pdp: config.PDP
})

apiRouter.get('/resources', async (req, res) => {
  const resources = await permit.api.resources.list()
  return res.json(resources)
})

apiRouter.post('/check', async(req, res) => {
  const { user, action, resources } = req.body
  const permitted = await permit.check(user, action, resources)

  if (permitted) {
    res.status(200).send(`${user} is permitted to ${action} the ${resources.type}`)
  } else {
    res.status(403).send(`${user} is not permitted to ${action} the ${resources.type}`)
  }
})

module.exports = apiRouter