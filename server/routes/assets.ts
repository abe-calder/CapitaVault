import express from 'express'
import { JwtRequest } from '../auth0.js'
import * as db from '../db/functions/assets.ts'
import checkJwt from '../auth0.ts'
import { wss } from '../server.ts'
import ws from 'ws'

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

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const { ticker, name, shares, cost, userId } = req.body

    const convert = {
      ticker: ticker as string,
      name: name as string,
      shares: shares as number,
      user_id: userId as number,
      cost: cost as string,
    }

    const result = await db.addAssets(convert)

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(
          JSON.stringify({
            type: 'database_change',
            message: 'New message added',
          }),
        )
      }
    })

    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user_id = Number(req.params.id)
    const result = await db.getAssets(user_id)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = Number(req.params.id)
    res.sendStatus(204)
    await db.deleteAssetById(id)

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(
          JSON.stringify({
            type: 'database_change',
            message: 'Message Deleted',
          }),
        )
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
