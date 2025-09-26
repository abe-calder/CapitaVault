import express from 'express'
import { JwtRequest } from '../auth0.js'
import * as db from '../db/functions/assets.ts'
import checkJwt from '../auth0.ts'

const router = express.Router()

router.get('/tickers', checkJwt, async(req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const result = await db.getTickersByUserId(auth0Id as string)
    res.json({result})
  } catch (error) {
    console.log(error)
  }
})

export default router