import express from 'express'
import { JwtRequest } from '../auth0.js'
import * as db from '../db/functions/assets.ts'
import checkJwt from '../auth0.ts'

const router = express.Router()

router.get('/tickers', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const result = await db.getTickersByUserId(auth0Id as string)
    res.json({ result })
  } catch (error) {
    console.log(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const { ticker, name, shares, userId } = req.body

    const convert = {
      ticker: ticker as string,
      name: name as string,
      shares: shares as number,
      user_id: userId as number,
    }

    const result = await db.addAssets(convert)
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await db
  } catch (error) [
    console.log(error)
  ]
})

export default router
