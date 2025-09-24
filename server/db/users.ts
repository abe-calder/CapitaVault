import connection from './connection.js'
import { User } from '../../models/users.js'

const columns = ['favouriteFruit']

export async function getUserById(
  auth0Id: string,
  db = connection,
): Promise<User> {
  return db('users').select('favouriteFruit').where('auth0Id', auth0Id).first()
}

export async function addUser(
  newUser: User,
  db = connection,
): Promise<User[]> {
  return db('users')
    .insert(newUser)
    .returning([...columns])
}
