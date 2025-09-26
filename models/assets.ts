
export interface Asset {
  ticker: string
  name: string
  shares: number
  userId: number
}

export interface AssetData extends Asset {
  id: number
}