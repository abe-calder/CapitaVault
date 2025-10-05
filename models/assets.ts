
export interface Asset {
  ticker: string
  name: string
  shares: number
  cost: string
  userId: number
}

export interface AssetData extends Asset {
  id: number
}