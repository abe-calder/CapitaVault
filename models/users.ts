export interface User {
  auth0Id: number
  name: string
  email: string
}

export interface UserData extends User {
  id: number
}

export interface NewUser {
  username: string
  auth0Id: string
  name: string
  email: string
}