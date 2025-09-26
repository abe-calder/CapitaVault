import connection from '../connection.ts'
import { UserData } from '../../../models/users.ts'
const db = connection

export async function addUser(newUser: {
  auth0Id: string
  name: string
  email: string
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
    const result = await db('users').where('users.auth0id', auth0Id).first()
    return result
  } catch (err) {
    console.log(err)
  }
}