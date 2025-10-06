import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

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
    console.log(allResults)
    res.json(allResults)
  }
})

export default router
