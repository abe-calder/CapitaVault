import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

// GET convertion rate
router.get('/:from/:to/:amount', async (req, res) => {
  try {
    const from = String(req.params.from).toLowerCase()
    const to = String(req.params.to).toLowerCase()
    const amount = String(req.params.amount)
    const response = await request
      .get(
        `https://api.fxratesapi.com/convert?from=${from}&to=${to}&amount=${amount}`,
      )
      .set('Authorization', `Bearer ${process.env.FX_RATE_API_KEY}`)
    res.json(response.body)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
export default router