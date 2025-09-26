import connection from '../connection.ts'
const db = connection

export async function getTickersByUserId(auth0Id: string) {
  try {
    const tickers = await db('assets').where({ auth0Id }).select('ticker')
    return tickers as []
  } catch (error) {
    console.log(error)
  }
}