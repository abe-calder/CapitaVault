import { useQuery } from '@tanstack/react-query'
import getAssetDataByTicker from '../../apis/polygon.ts'
import { AssetData } from '../../../models/assets.ts'

const testTickers = [
  { id: 1, name: 'Bitcoin', ticker: 'X:BTCUSD', shares: 1 },
  { id: 2, name: 'Ethereum', ticker: 'X:ETHUSD', shares: 2 },
  { id: 3, name: 'Apple', ticker: 'AAPL', shares: 3 },
  { id: 4, name: 'Tesla', ticker: 'TSLA', shares: 4 },
  { id: 5, name: 'Solana', ticker: 'X:SOLNZD', shares: 5 },
] as AssetData[]

export default function TickerTest() {
  // Only send up to 5 tickers to avoid hitting the rate limit
  const tickersToTest = testTickers.slice(0, 5)
  const { data, isLoading, error } = useQuery({
    queryKey: ['tickerTest', tickersToTest],
    queryFn: () => getAssetDataByTicker(tickersToTest),
  })

  if (isLoading) return <div>Loading test tickers...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  // Build a lookup by cleaned ticker
  const resultsByTicker: Record<string, any> = {}
  if (data) {
    data.forEach((asset: any) => {
      if (asset && asset.ticker) {
        resultsByTicker[asset.ticker.replace(/^X:/, '').replace(/USD$/, '')] =
          asset
      }
    })
  }

  return (
    <div>
      <h2>TickerTest Results</h2>
      <div className="holdings-display">
        {tickersToTest.map((asset) => {
          const cleanTicker = asset.ticker
            .replace(/^X:/, '')
            .replace(/USD$/, '')
          const assetData = resultsByTicker[cleanTicker]
          return (
            <div className="asset-holdings-wrapper" key={asset.id}>
              <h3>
                {asset.name} ({asset.ticker})
              </h3>
              <div>
                {assetData && assetData.results && assetData.results[0] ? (
                  <span>
                    Value: ${(assetData.results[0].c * asset.shares).toFixed(2)}
                  </span>
                ) : (
                  <span>No data</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
