export interface ConvertResponse {
  success: boolean
  query: Query
  info: Info
  historical: boolean
  date: string
  timestamp: number
  result: number
}

export interface Info {
  rate: number
}

export interface Query {
  from: string
  to: string
  amount: number
}

export interface ConvertPost {
  from: string
  to: string
  amount: number
}