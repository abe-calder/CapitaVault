import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

// GET convertion rate
router.get('/:from/:to/:amount', async (req, res) => {
  const from = String(req.params.from).toLowerCase()
  const to = String(req.params.to).toLowerCase()
  const amount = String(req.params.to).toLowerCase()
  const response = await request
    .get(
      `https://api.fxratesapi.com/convert?from=${from}&to=${to}&amount=${amount}&format=json`,
    )
    .set('Authorization', `Bearer ${process.env.FX_RATE_API_KEY}`)
  console.log(response.body)
  res.json(response.body)
})
export default router