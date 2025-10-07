import express from 'express'
import { JwtRequest } from '../auth0.js'
import checkJwt from '../auth0.js'
import { wss } from '../server.ts'
import ws from 'ws'
import * as db from '../db/functions/users.ts'

const router = express.Router()

// get /api/v1/users route
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something Went Wrong...')
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const newUser = req.body
    const auth0Id = req.auth?.sub

    const user = await db.addUser({
      ...newUser,
      auth0Id,
    })
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something Went Wrong...')
  }
})

router.get('/me', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const result = await db.getUserById(auth0Id as string)
    res.json({ user: result })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.patch('/me', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = String(req.auth?.sub)
    const updatedUser = req.body
    const result = await db.updateUser(auth0Id, updatedUser)

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

    res.json({ updatedUser: result })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }

})

export default router
