import request from 'superagent'
import { NewUser, UpdatedUser, User, UserData } from '../../models/users.ts'

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
  newUser: NewUser
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

interface UpdateUserFunction {
  updatedUser: UpdatedUser
  token: string
}

export async function updateUser({ updatedUser, token }: UpdateUserFunction): Promise<User> {
  console.log(updatedUser)
  return request
    .patch(`${rootURL}/users/me`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedUser)
    .then((res) => res.body.updatedUser)
}

