export interface Polygon {
  ticker: string
  queryCount: number
  resultsCount: number
  adjusted: boolean
  results: Result[]
  status: string
  request_id: string
  count: number
}

export interface Results {
  ticker: string
  results: Result[]
}

export interface Result extends Results {
  v: number
  vw: number
  o: number
  c: number
  h: number
  l: number
  t: number
  n: number
}
