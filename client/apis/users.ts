import request from 'superagent'
import { User, UserData } from '../../models/users.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

interface GetUserFunction {
  token: string
}

export async function getUser({
  token,
}: GetUserFunction): Promise<UserData | null> {
  return await request
    .get(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => (res.body.user ? res.body.user : null))
}

interface AddUserFunction {
  newUser: User
  token: string
}

export async function addUser({
  newUser,
  token,
}: AddUserFunction): Promise<User> {
  return request
    .post(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((res) => res.body.user)
}
