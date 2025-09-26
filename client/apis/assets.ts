import request from 'superagent'
import { AssetData } from '../../models/assets.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUsersTickers(token: string) {
  const response = await request
    .get(`${rootURL}/assets/tickers`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as AssetData[]
}

interface newAsset {
  ticket: string
  name: string
  shares: number
  userId: number
}

export async function addAssets(token: string, newAsset: newAsset) {
  const result = await request
    .post(`${rootURL}/assets`)
    .set('Authorization', `Bearer ${token}`)
    .send(newAsset)
  return result.body as AssetData
}
