import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'
import { useGetAssets } from '../hooks/useAssets'
import { useUsers } from '../hooks/useUsers'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'
import { useState, useMemo } from 'react'
import { PieChart, Pie, Tooltip, Cell } from 'recharts'
import { useFxRatesContext } from '../context/FxRatesContext.tsx'
import { usePolygonDataContext } from '../context/PolygonDataContext.tsx'

export default function Dashboard() {
  const { user } = useAuth0()

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
      polygonData.forEach((asset) => {
        if (asset && asset.ticker) {
          tickerMap[asset.ticker.replace(/^X:/, '').replace(/USD$/, '')] = asset
        }
      })
    }
    return tickerMap
  }, [polygonData])

  const fxRate = fxRates[convertToCurrency] ?? null

  function handleToggleCurrency(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const selectedCurrency = (e.target as HTMLButtonElement).value
    setConvertToCurrency(selectedCurrency)
  }

  const formatCurrency = (usdValue: number) => {
    if (convertToCurrency === 'USD') {
      return `$${usdValue.toFixed(2)}`
    }
    if (isFxLoading) return 'Loading FX...'
    if (fxError) return 'FX Error'
    if (fxRate) {
      return `${convertToCurrency} ${(usdValue * fxRate).toFixed(2)}`
    }
    return 'No FX rate'
  }

  const { totalBalance, totalCost, income, pieChartData } = useMemo(() => {
    let runningTotalBalance = 0
    let runningTotalCost = 0

    const chartData = userAssetData.map((asset: AssetData) => {
      const cleanTicker = asset.ticker.replace(/^X:/, '').replace(/USD$/, '')
      const assetData = resultsByTicker[cleanTicker]
      let currentUsdValue = 0

      if (assetData && assetData.results && assetData.results[0]) {
        currentUsdValue = assetData.results[0].c * asset.shares
        runningTotalBalance += currentUsdValue
      }

      // cost parsing
      const cleanedCost = asset.cost.replace(/[^0-9.]/g, '')
      const currencyMatch = asset.cost.match(/[a-zA-Z]+/)
      const costCurrency = currencyMatch
        ? currencyMatch[0].toUpperCase()
        : 'USD' // Default to USD if no currency found
      const costValue = parseFloat(cleanedCost)

      if (!isNaN(costValue)) {
        if (costCurrency === 'USD') {
          runningTotalCost += costValue
        } else {
          const rate = fxRates[costCurrency]
          // Convert cost to USD
          if (rate) runningTotalCost += costValue / rate
        }
      }

      return { name: asset.name, value: currentUsdValue }
    })

    const balanceInSelectedCurrency =
      convertToCurrency === 'USD' || !fxRate
        ? runningTotalBalance
        : runningTotalBalance * fxRate

    return {
      totalBalance: balanceInSelectedCurrency,
      totalCost: runningTotalCost,
      income: balanceInSelectedCurrency - runningTotalCost,
      pieChartData: chartData,
    }
  }, [userAssetData, resultsByTicker, convertToCurrency, fxRate, fxRates])

  const assetDataValues = userAssetData.map((asset: AssetData) => {
    const cleanTicker = asset.ticker.replace(/^X:/, '').replace(/USD$/, '')
    const assetData = resultsByTicker[cleanTicker]
    const usdValue =
      assetData && assetData.results?.[0]
        ? assetData.results[0].c * asset.shares
        : 0
    return (
      <div className="asset-holdings-wrapper" key={asset.id}>
        <h1 className="asset-holdings-name">{asset.name}</h1>
        <div className="asset-holdings-shares">
          <p className="asset-holdings-value">{formatCurrency(usdValue)}</p>
          <p className="asset-shares">
            {asset.shares} {asset.ticker}
          </p>
        </div>
      </div>
    )
  })

  if (isPolygonLoading) {
    return <div>Loading Dashboard...</div>
  }

  if (polygonError) {
    const errorMessage = polygonError
    return <div>Error: {errorMessage}</div>
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <>
      <div className="app2">
        <Nav />
        <div className="dashboard-wrapper">
          <div className="heading-and-total-balance-wrapper">
            <h1 className="dashboard-heading">Dashboard</h1>
            <div className="total-balance">
              <h2 className="total-balance-heading">Total Balance</h2>
              <p className="total-balance-value">
                {convertToCurrency} {totalBalance.toFixed(2)}
              </p>
              <div className="total-cost-value">
                <p className="total-cost-expense-p">&#8964; Expense</p>
                {formatCurrency(totalCost)}
                <h1 className="total-balance-divider"> | </h1>
                <p className="total-income-p">^ Income </p>
                <p className="total-income-value">
                  {convertToCurrency} {income.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="statistics-wrapper">
            <div className="statistics">
              <h2 className="statistics-heading">Statistics</h2>
              {pieChartData.length > 0 && (
                <PieChart width={200} height={200} className="pie-chart">
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="5vw"
                    cy="5vh"
                    outerRadius={99}
                    fill="#8884d8"
                  >
                    {pieChartData.map((_entry: unknown, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              )}
            </div>
          </div>
          <div className="goals-wrapper">
            <div className="goals">
              <h1 className="goals-heading">Goals</h1>
              <h3 className="goals-sub-heading">Add Goals here</h3>
            </div>
          </div>
          <div className="spending-wrapper">
            <div className="spending">
              <h2 className="spending-heading">Spending Overview</h2>
            </div>
          </div>
          <div className="profile-and-holdings-wrapper">
            <div className="profile">
              {user && (
                <object
                  type="image/jpeg"
                  data={user.picture}
                  className="profile-photo"
                >
                  <img
                    src="/images/profile-photo-fallback.webp"
                    alt="fallback-img"
                  ></img>
                </object>
              )}
              {user && <h1 className="profile-name">{user.name}</h1>}
            </div>
            <div className="holdings">
              <h1 className="holdings-heading">Holdings</h1>
              <div className="holdings-buttons">
                <label
                  htmlFor="toggle-currency"
                  className="toggle-currency-label"
                >
                  Toggle Currency
                  <button
                    className="toggle-currency-buttons"
                    value="USD"
                    onClick={(e) => handleToggleCurrency(e)}
                  >
                    USD
                  </button>
                  <button
                    className="toggle-currency-buttons"
                    value="NZD"
                    onClick={(e) => handleToggleCurrency(e)}
                  >
                    NZD
                  </button>
                  <button
                    className="toggle-currency-buttons"
                    value="AUD"
                    onClick={(e) => handleToggleCurrency(e)}
                  >
                    AUD
                  </button>
                  <button
                    className="toggle-currency-buttons"
                    value="EUR"
                    onClick={(e) => handleToggleCurrency(e)}
                  >
                    EUR
                  </button>
                  <button
                    className="toggle-currency-buttons"
                    value="GBP"
                    onClick={(e) => handleToggleCurrency(e)}
                  >
                    GBP
                  </button>
                </label>
              </div>
              <div className="holdings-display">{assetDataValues}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
