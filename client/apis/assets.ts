import request from 'superagent'
import { AssetData } from '../../models/assets.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUsersTickers(token: string) {
  const response = await request
    .get(`${rootURL}/assets/tickers`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as AssetData[]
}

interface AddAssetFunction {
  newAsset: AssetData
  token: string
}

export async function addAssets({ newAsset, token }: AddAssetFunction) {
  const result = await request
    .post(`${rootURL}/assets`)
    .set('Authorization', `Bearer ${token}`)
    .send(newAsset)
  return result.body
}
