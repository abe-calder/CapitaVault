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

export async function addAssets(newAsset: {
  ticker: string
  name: string
  shares: number
  user_id: number
  cost: string
}) {
  try {
    const result = await db('assets')
      .insert(newAsset)
      .returning('*')
    return result
  } catch (error) {
    console.log(error)
  }
}

export async function getAssets(user_id: number) {
  try {
    const result = await db('assets').where({user_id}).select('id as id', 'ticker as ticker', 'name as name', 'shares as shares', 'cost as cost', 'user_id as userId')
    return result
  } catch (error) {
    console.log(error)
  }
}

export async function deleteAssetById(id: number) {
  try {
    return await db('assets').where({ id }).delete()
  } catch (error) {
    console.log(error)
  }
}