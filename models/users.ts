export interface User {
  auth0Id: number
  name: string
  email: string
  username: string
  goal: string
  goalCost: string
}

export interface UserData extends User {
  id: number
}

export interface NewUser {
  username: string
  auth0Id: string
  name: string
  email: string
  goal: string
  goalCost: string
}

export interface UpdatedUser {
  name: string
  email: string
  username: string
  goal: string
  goalCost: string
}