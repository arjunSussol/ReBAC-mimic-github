require('dotenv').config({ override: true })

const PORT = process.env.PORT
const PERMIT_API_KEY = process.env.PERMIT_API_KEY
const PDP = process.env.PDP

module.exports = { PORT, PERMIT_API_KEY, PDP }