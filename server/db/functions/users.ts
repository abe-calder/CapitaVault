import connection from '../connection.ts'
import { UserData } from '../../../models/users.ts'
const db = connection

export async function addUser(newUser: {
  auth0Id: string
  name: string
  email: string
  goal: string
  goalCost: string
  username: string
}): Promise<UserData[] | undefined> {
  try {
    const result = await db('users').insert(newUser).returning('*')
    return result
  } catch (err) {
    console.log(err)
  }
}

export async function getUserById(
  auth0Id: string,
): Promise<UserData[] | undefined> {
  try {
    const result = await db('users').where('users.auth0Id', auth0Id).first()
    return result
  } catch (err) {
    console.log(err)
  }
}

export async function updateUser(auth0Id: string, updatedUser: {
  name: string
  email: string
  username: string
  goal: string
  goalCost: string
}): Promise<UserData | undefined> {
  try {
    return await db('users').where('users.auth0Id', auth0Id).update({ name: updatedUser.name, email: updatedUser.email, username: updatedUser.username, goal: updatedUser.goal, goalCost: updatedUser.goalCost})
  } catch (err) {
    console.log(err)
  }
} 