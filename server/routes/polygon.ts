import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const formattedDate = yesterday.toISOString().slice(0, 10)


// GET CryptoCurrency 
router.get('/', async (req, res) => {
  const response = await request
    .get(
      `https://api.polygon.io/v2/aggs/ticker/X:HBARUSD/range/1/day/${formattedDate}/${formattedDate}`,
    )
    .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
  console.log(response.body)
  res.json(response.body)
})


export default router
