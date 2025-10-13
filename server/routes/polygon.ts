import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

// 12 month date range for second request /history/:ticker
function getPreviousAndCurrentYearTimeframe(): {
  previousYear: string
  currentYear: string
} {
  const today: Date = new Date()

  const oneYearAgo: Date = new Date(today.getTime())

  oneYearAgo.setFullYear(today.getFullYear() - 1)

  const formatDate = (date: Date): string => {
    const year: number = date.getFullYear()

    const month: string = String(date.getMonth() + 1).padStart(2, '0')

    const day: string = String(date.getDate() - 1).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return {
    previousYear: formatDate(oneYearAgo),
    currentYear: formatDate(today),
  }
}

router.get('/', async (req, res) => {
  const tickersArr: string[] | string | undefined = String(req.query.tickers)
  if (tickersArr) {
    const tickers: string[] = tickersArr
      .split(',')
      .filter((t) => t && t !== 'undefined')
    if (tickers.length === 0) {
      return res.status(400).json({ error: 'No valid tickers provided.' })
    }

    // crypto tickers
    const firstPromises = tickers.map((t) =>
      request
        .get(`https://api.polygon.io/v2/aggs/ticker/${t}/prev`)
        .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
        .then((response) => ({
          ticker: t,
          results: response.body.results || [],
        }))
        .catch(() => ({
          ticker: t,
          results: [],
        })),
    )
    const firstResponses = await Promise.all(firstPromises)

    // find tickers with empty results
    const retryTickers = firstResponses
      .filter((r) => !r.results || r.results.length === 0)
      .map((r) => r.ticker.replace(/^X:/, '').replace(/USD$/, ''))

    // stock tickers (after removing X: and USD)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let secondResponses: any[] = []
    if (retryTickers.length > 0) {
      const secondPromises = retryTickers.map((t) =>
        request
          .get(`https://api.polygon.io/v2/aggs/ticker/${t}/prev`)
          .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
          .then((response) => ({
            ticker: `X:${t}USD`, // Return the original ticker format
            results: response.body.results || [],
          }))
          .catch(() => ({
            ticker: `X:${t}USD`,
            results: [],
          })),
      )
      secondResponses = await Promise.all(secondPromises)
    }

    // combine
    const successfulFirstResponses = firstResponses.filter(
      (r) => r.results && r.results.length > 0,
    )

    // map of successful tickers to avoid duplicates
    const successfulTickers = new Set(
      successfulFirstResponses.map((r) => r.ticker),
    )

    // filter out any tickers from the second response that were already successful
    const successfulSecondResponses = secondResponses.filter(
      (r) => !successfulTickers.has(r.ticker),
    )

    const allResults = [
      ...successfulFirstResponses,
      ...successfulSecondResponses,
    ]
    res.json(allResults)
  }
})

const timeframe = getPreviousAndCurrentYearTimeframe()

router.get('/history/:ticker', async (req, res) => {
  const tickersArr: string[] | string | undefined = String(req.params.ticker)
  if (tickersArr) {
    const tickers: string[] = tickersArr
      .split(',')
      .filter((t) => t && t !== 'undefined')
    if (tickers.length === 0) {
      return res.status(400).json({ error: 'No valid tickers provided.' })
    }

    const cryptoTickers = tickers.map((ticker) =>
      request
        .get(
          `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/month/${timeframe.previousYear}/${timeframe.currentYear}?adjusted=true&sort=asc&limit=230`,
        )
        .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
        .then((response) => ({
          ticker: ticker,
          results: response.body.results || [],
        }))
        .catch(() => ({
          ticker: ticker,
          results: [],
        })),
    )
    const firstResponses = await Promise.all(cryptoTickers)

    const retryTickers = firstResponses
      .filter((r) => !r.results || r.results.length === 0)
      .map((r) => r.ticker.replace(/^X:/, '').replace(/USD$/, ''))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let secondResponses: any[] = []
    if (retryTickers.length > 0) {
      const stockTickers = retryTickers.map((ticker) =>
        request
          .get(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/month/${timeframe.previousYear}/${timeframe.currentYear}?adjusted=true&sort=asc&limit=230`,
          )
          .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
          .then((response) => ({
            ticker: `X:${ticker}USD`, // Return the original ticker format
            results: response.body.results || [],
          }))
          .catch(() => ({
            ticker: `X:${ticker}USD`,
            results: [],
          })),
      )
      secondResponses = await Promise.all(stockTickers)
    }

    // combine
    const successfulFirstResponses = firstResponses.filter(
      (r) => r.results && r.results.length > 0,
    )

    // map of successful tickers to avoid duplicates
    const successfulTickers = new Set(
      successfulFirstResponses.map((r) => r.ticker),
    )

    // filter out any tickers from the second response that were already successful
    const successfulSecondResponses = secondResponses.filter(
      (r) => !successfulTickers.has(r.ticker),
    )

    const allResults = [
      ...successfulFirstResponses,
      ...successfulSecondResponses,
    ]
    res.json(allResults)
  }
})

router.get('/holidays', async (req, res) => {
  const response = await request
    .get(
      'https://api.polygon.io/v1/marketstatus/upcoming',
    )
    .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
  console.log(response.body)
  res.json(response.body)
})

export default router
