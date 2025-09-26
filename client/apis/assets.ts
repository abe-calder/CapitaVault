import request from 'superagent'
import { AssetData } from '../../models/assets.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUsersTickers(token: string) {
  const response = await request
    .get(`${rootURL}/assets/tickers`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as AssetData[]
}