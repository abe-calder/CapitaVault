import request from 'superagent'
import { Result } from '../../models/polygon'

const rootURL = new URL(`/api/v1`, document.baseURI)

export default async function getAssetDataByTicker(ticker: string) {
  const response = await request.get(`${rootURL}/polygon/${ticker}`)
  return response.body as Result
}