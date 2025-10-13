import { createContext, useContext, ReactNode, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUsers } from '../hooks/useUsers'
import { useGetAssets } from '../hooks/useAssets'
import { useFxRatesContext } from './FxRatesContext'
import getAssetDataByTicker, { getAssetHistory } from '../apis/polygon'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'

interface PortfolioState {
  totalBalance: number
  totalCost: number
  income: number
  totalBalanceUsd: number
  pieChartData: {
    name: string
    value: number
    cost: number
    ticker: string
    shares: number
    yearlyRevenue: number
  }[]
  monthlyData: {
    month: string
    value: number
  }[]
  convertCurrency: string
  setConvertCurrency: (currency: string) => void
  gainOrLoss: () => JSX.Element
  individualGainOrLoss: (value: number, cost: number) => JSX.Element
  isLoading: boolean
  error: string | null
}

const PortfolioContext = createContext<PortfolioState | undefined>(undefined)

export function PortfolioProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const getMe = useUsers()
  const userId = getMe.data?.id
  const { data: userAssetData = [], isLoading: areAssetsLoading } =
    // @ts-expect-error enabled !!userId is nessesery dependency
    useGetAssets(userId!, {
      enabled: !!userId,
    })

  const {
    data: polygonData = [],
    isLoading: isPolygonLoading,
    error: polygonError,
  } = useQuery({
    queryKey: ['polygonMarketData', userAssetData],
    queryFn: () => getAssetDataByTicker(userAssetData),
    enabled: userAssetData.length > 0,
    staleTime: 500 * 60 * 60, // 1 hour
    refetchInterval: 500 * 60 * 60,
    refetchOnWindowFocus: false,
  })

  const tickersForHistory = useMemo(
    () => userAssetData.map((asset) => asset.ticker),
    [userAssetData],
  )

  const {
    data: historicalData = [],
    isLoading: isHistoricalLoading,
    error: historicalError,
  } = useQuery({
    queryKey: ['historicalData', tickersForHistory],
    queryFn: () => getAssetHistory(tickersForHistory),
    enabled: tickersForHistory.length > 0,
    staleTime: 500 * 60 * 60, // 1 hour
    refetchInterval: 500 * 60 * 60,
    refetchOnWindowFocus: false,
  })

  const {
    rates: fxRates,
    isLoading: isFxLoading,
    error: fxError,
  } = useFxRatesContext()
  const [convertCurrency, setConvertCurrency] = useState('NZD') // state for user selection

  const resultsByTicker = useMemo(() => {
    const tickerMap: Record<string, Results> = {}
    if (polygonData) {
      polygonData.forEach((asset: Results) => {
        if (asset?.ticker) {
          // extract the base ticker, e.g. 'BTC' from 'X:BTCUSD', to use as a consistent key.
          const baseTicker = asset.ticker.replace(/^X:|USD$/g, '')
          tickerMap[baseTicker] = asset
        }
      })
    }
    return tickerMap
  }, [polygonData])

  const userAssetsByTicker = useMemo(() => {
    const assetMap: Record<string, AssetData> = {}
    userAssetData.forEach((asset) => {
      assetMap[asset.ticker] = asset
    })
    return assetMap
  }, [userAssetData])

  const portfolioMetrics = useMemo(() => {
    let totalBalance = 0
    let totalCost = 0
    let totalBalanceUsd = 0
    const pieChartData: {
      name: string
      value: number
      shares: number
      ticker: string
      cost: number
      yearlyRevenue: number
    }[] = []
    const monthlyTotals = new Map<number, number>()
    const monthlyData: {
      month: string
      value: number
    }[] = []

    if (
      userAssetData.length > 0 &&
      Object.keys(resultsByTicker).length > 0 &&
      Object.keys(fxRates).length > 0
    ) {
      userAssetData.forEach((asset: AssetData) => {
        const marketData = resultsByTicker[asset.ticker]
        if (!marketData) return

        const currentPrice = marketData.results?.[0]?.c ?? 0 // current price in this case is really the close price from the day before - Free API moment lol
        const quantity = asset.shares

        const costString = asset.cost
        const costValue = parseFloat(costString.replace(/[^0-9.]/g, ''))
        const currencyMatch = costString.match(/[a-zA-Z]+/)
        const costCurrency = currencyMatch
          ? currencyMatch[0].toUpperCase()
          : 'USD' // default to USD if no currency is found in the string

        const marketPriceCurrency = 'USD'
        const toCurrency = convertCurrency.toUpperCase()

        // rate to convert from the market price currency (USD) to the selected display currency / 'Toggle Currency buttonns'
        const marketToSelectedRate =
          fxRates[toCurrency] / fxRates[marketPriceCurrency]
        // rate to convert from the original cost currency to the selected display currency
        const costToSelectedRate = fxRates[toCurrency] / fxRates[costCurrency]

        const rateToUsd = 1

        const currentValueInSelectedCurrency =
          currentPrice * quantity * marketToSelectedRate
        // the 'costValue' is the total cost, then convert it to the selected currency
        const costInSelectedCurrency = !isNaN(costValue)
          ? costValue * costToSelectedRate
          : 0

        const yearlyRevenueInSelectedCurrency =
          currentValueInSelectedCurrency - costInSelectedCurrency

        const currentValueInUsd = currentPrice * quantity * rateToUsd

        totalBalance += currentValueInSelectedCurrency
        totalCost += costInSelectedCurrency
        totalBalanceUsd += currentValueInUsd

        pieChartData.push({
          name: asset.name,
          value: currentValueInSelectedCurrency,
          ticker: asset.ticker,
          cost: costInSelectedCurrency,
          shares: asset.shares,
          yearlyRevenue: yearlyRevenueInSelectedCurrency,
        })
      })

      if (historicalData.length > 0) {
        historicalData.forEach((assetHistory) => {
          // Normalize the ticker from historical data to match the key in userAssetsByTicker
          // e.g., 'X:BTCUSD' becomes 'BTC'
          const baseTicker = assetHistory.ticker.replace(/^X:|USD$/g, '')
          const asset = userAssetsByTicker[baseTicker]
          if (!asset) return

          assetHistory.results.forEach((monthlyResult) => {
            // Normalize the timestamp to the start of the month (UTC)
            // This prevents duplicate months if timestamps differ slightly (e.g., by a few hours)
            const date = new Date(monthlyResult.t)
            date.setUTCDate(1)
            date.setUTCHours(0, 0, 0, 0)
            const normalizedMonthTimestamp = date.getTime()

            const price = monthlyResult.c
            const valueForAsset = price * asset.shares
            const currentTotal =
              monthlyTotals.get(normalizedMonthTimestamp) || 0
            monthlyTotals.set(
              normalizedMonthTimestamp,
              currentTotal + valueForAsset,
            )
          })
        })

        const sortedMonthlyData = Array.from(monthlyTotals.entries()).sort(
          (a, b) => a[0] - b[0],
        )

        const toCurrency = convertCurrency.toUpperCase()
        const marketToSelectedRate = fxRates[toCurrency] / fxRates['USD']

        sortedMonthlyData.forEach(([timestamp, value]) => {
          const valueInSelectedCurrency = value * marketToSelectedRate

          monthlyData.push({
            month: new Date(timestamp).toLocaleString('default', {
              month: 'short',
              year: '2-digit',
            }),
            value: valueInSelectedCurrency,
          })
        })
      }
    }

    function gainOrLoss() {
      const percentageGainOrLoss =
        ((totalBalance - totalCost) / totalBalance) * 100
      if (percentageGainOrLoss > 0) {
        return (
          <>
            {' '}
            <img
              alt="up-arrow-gain"
              className="up-arrow-gain"
              src="/images/up-arrow-gain.webp"
            ></img>{' '}
            {percentageGainOrLoss.toFixed(1)}%{' '}
          </>
        )
      } else if (percentageGainOrLoss < 0) {
        return (
          <>
            {' '}
            <img
              alt="down-arrow-loss"
              className="down-arrow-loss"
              src="/images/down-arrow-loss.webp"
            ></img>{' '}
            {percentageGainOrLoss.toFixed(1)}%{' '}
          </>
        )
      } else {
        return <span>0%</span>
      }
    }

    function individualGainOrLoss(value: number, cost: number) {
      const percentageGainOrLoss = ((value - cost) / cost) * 100

      if (percentageGainOrLoss > 0) {
        return (
          <>
            <span>+{percentageGainOrLoss.toFixed(1)}%</span>
          </>
        )
      } else if (percentageGainOrLoss < 0) {
        return (
          <>
            <span>{percentageGainOrLoss.toFixed(1)}%</span>
          </>
        )
      } else {
        return (
          <>
            <span>0%</span>
          </>
        )
      }
    }

    return {
      totalBalance,
      totalCost,
      totalBalanceUsd,
      pieChartData,
      income: 0,
      gainOrLoss,
      individualGainOrLoss,
      monthlyData,
    }
  }, [
    userAssetData,
    resultsByTicker,
    convertCurrency,
    fxRates,
    historicalData,
    userAssetsByTicker,
  ])

  const isLoading =
    getMe.isLoading ||
    areAssetsLoading ||
    isPolygonLoading ||
    isFxLoading ||
    isHistoricalLoading
  const error =
    (getMe.error as Error)?.message ||
    (polygonError as Error)?.message ||
    fxError ||
    (historicalError as Error)?.message

  const value: PortfolioState = {
    ...portfolioMetrics,
    convertCurrency: convertCurrency,
    setConvertCurrency,
    isLoading,
    error: error || null,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
