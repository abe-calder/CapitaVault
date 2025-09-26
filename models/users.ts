export interface User {
  auth0Id: number
  name: string
  email: string
}

export interface UserData extends User {
  id: number
}