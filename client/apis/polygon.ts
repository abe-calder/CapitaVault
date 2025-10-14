import request from 'superagent'
import { Result } from '../../models/polygon'

const rootURL = new URL(`/api/v1`, document.baseURI)

export default async function getAssetDataByTicker(
  tickerArray: { ticker: string }[],
) {
  const assetTickers = tickerArray
    .map((asset) => {
      const upperTicker = asset.ticker.toUpperCase()
      // format the ticker for the backend's first attempt (crypto).
      // backend will handle retrying as a stock if this fails.
      // prevents sending tickers like 'X:X:BTCUSDUSD' if user manually enters a full one.
      return upperTicker.startsWith('X:') ? upperTicker : `X:${upperTicker}USD`
    })
    .join(',')
  const queryString = `?tickers=${assetTickers}`
  const response = await request.get(`${rootURL}/polygon/${queryString}`)
  return response.body as Result[]
}

export async function getAssetHistory(tickerArray: string[]) {
  const assetTickers = tickerArray
    .map((asset) => {
      const upperTicker = asset.toUpperCase()
      // same as function above
      return upperTicker.startsWith('X:') ? upperTicker : `X:${upperTicker}USD`
    })
    .join(',')
  const queryString = assetTickers

  const response = await request.get(
    `${rootURL}/polygon/history/${queryString}`,
  )
  return response.body
}


export async function getMarketHolidays() {
  const response = await request.get(`${rootURL}/polygon/holidays`)
  return response.body
}