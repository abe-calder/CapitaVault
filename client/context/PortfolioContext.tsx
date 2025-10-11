import { createContext, useContext, ReactNode, useMemo, useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useGetAssets } from '../hooks/useAssets'
import { usePolygonDataContext } from './PolygonDataContext'
import { useFxRatesContext } from './FxRatesContext'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'

interface PortfolioState {
  totalBalance: number
  totalCost: number
  income: number
  totalBalanceUsd: number
  pieChartData: { name: string; value: number }[]
  convertCurrency: string
  setConvertCurrency: (currency: string) => void
  isLoading: boolean
  error: string | null
}

const PortfolioContext = createContext<PortfolioState | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const getMe = useUsers()
  const userId = getMe.data?.id

  // @ts-expect-error enabled !!userId is the only option
  const { data: userAssetData = [] } = useGetAssets(userId, {
    enabled: !!userId,
  })

  const {
    rates: fxRates,
    isLoading: isFxLoading,
    error: fxError,
  } = useFxRatesContext()
  const {
    polygonData,
    isLoading: isPolygonLoading,
    error: polygonError,
  } = usePolygonDataContext()
  const [convertToCurrency, setConvertToCurrency] = useState('NZD') // state for user selection

  const resultsByTicker = useMemo(() => {
    const tickerMap: Record<string, Results> = {}
    if (polygonData) {
      polygonData.forEach((asset: Results) => {
        if (asset && asset.ticker) {
          tickerMap[asset.ticker] = asset
        }
      })
    }
    return tickerMap
  }, [polygonData])

  const portfolioMetrics = useMemo(() => {
    let toalBalance = 0
    let totalCost = 0
    let totalBanaceUsd = 0
    const pieChartData: { name: string; value: number }[] = []
    
    if (
      userAssetData.length > 0 &&
      Object.keys(resultsByTicker).length > 0 &&
      Object.keys(fxRates).length > 0
    ) {
      userAssetData.forEach((asset: AssetData) => {
        const marketData = resultsByTicker[asset.symbol]
        if (!marketData) return

        const currentPrice = marketData.c // closing price from polygon
        const quantity = asset.quantity 
        const averageCost = asset.average_cost 
        
        const assetCurrency = asset.currency.toUpperCase()
        const toCurrency = convertToCurrency.toUpperCase()

        // Get conversion rates, default to 1 if not found
        const rateToSelected = fxRates['USD'] / fxRates[assetCurrency] || 1
      })
    }
  })

}
