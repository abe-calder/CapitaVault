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

export async function getAssets(userId: number, token: string) {
  const response = await request
    .get(`${rootURL}/assets/${userId}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}

interface DeleteAssetFunction {
  id: number
  token: string
}
interface GetAssetByUserIdFunction {
  userId: number
  token: string
}

export async function deleteAssetById({ id, token }: DeleteAssetFunction) {
  await request
    .delete(`${rootURL}/assets/${id}`)
    .set('Authorization', `Bearer ${token}`)
  return
}

export async function getAssetsByUserId({ userId, token }: GetAssetByUserIdFunction) {
  const res = await request
    .get(`${rootURL}/assets/${userId}`)
    .set('Authorization', `Bearer ${token}`)
  return res.body as AssetData[]
}
