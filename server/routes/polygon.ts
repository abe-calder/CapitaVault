import express from 'express'
import 'dotenv/config'
import request from 'superagent'

const router = express.Router()

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const formattedDate = yesterday.toISOString().slice(0, 10)

router.get('/', async (req, res) => {
  const tickersArr: string[] | string | undefined = String(req.query.tickers)
  if (tickersArr) {
    const tickers: string[] = tickersArr
      .split(',')
      .filter((t) => t && t !== 'undefined')
    if (tickers.length === 0) {
      return res.status(400).json({ error: 'No valid tickers provided.' })
    }

    // Crypto tickers
    const firstPromises = tickers.map((t) =>
      request
        .get(
          `https://api.polygon.io/v2/aggs/ticker/${t}/range/1/day/${formattedDate}/${formattedDate}`,
        )
        .set('Authorization', `Bearer ${process.env.POLY_API_KEY}`)
        .then((response) => ({
          ticker: t.replace(/^X:/, '').replace(/USD$/, ''),
          results: response.body.results || [],
        }))
        .catch(() => ({
          ticker: t.replace(/^X:/, '').replace(/USD$/, ''),
          results: [],
        })),
    )
    const firstResponses = await Promise.all(firstPromises)

    // Find tickers with empty results
    const retryTickers = firstResponses
      .filter((r) => !r.results || r.results.length === 0)
      .map((r, idx) => tickers[idx].replace(/^X:/, '').replace(/USD$/, ''))

    // (after removing X: and USD) Stock tickers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let secondResponses: any[] = []
    if (retryTickers.length > 0) {
      const secondPromises = retryTickers.map((t) =>
        request
          .get(
            `https://api.polygon.io/v2/aggs/ticker/${t}/prev`
          )
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
      secondResponses = await Promise.all(secondPromises)
    }

    // Combine
    const allResults = [
      ...firstResponses.filter((r) => r.results && r.results.length > 0),
      ...secondResponses.filter((r) => r.results && r.results.length > 0),
    ]
    console.log(allResults)
    res.json(allResults)
  }
})

export default router
