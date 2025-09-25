import express from 'express'
import { JwtRequest } from '../auth0.js'
import checkJwt from '../auth0.js'

import * as db from '../db/users.ts'

const router = express.Router()

// get /api/v1/users route
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    console.log(user)
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

    const [user] = await db.addUser({
      ...newUser,
      auth0Id,
    })
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something Went Wrong...')
  }
})

export default router
