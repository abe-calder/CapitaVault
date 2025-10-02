import request from 'superagent'
import { Result } from '../../models/polygon'

const rootURL = new URL(`/api/v1`, document.baseURI)

export default async function getAssetDataByTicker(tickerArray : { ticker: string }[]) {
  const assetTickers = tickerArray.map((asset) => `X:${asset.ticker}USD`).join(',')
  const queryString = `?tickers=${assetTickers}`
  const response = await request.get(`${rootURL}/polygon/${queryString}`)
  return response.body as Result[]
}
