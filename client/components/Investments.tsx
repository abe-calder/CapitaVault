import Nav from './Nav'
import TopRightProfile from './TopRightProfile'
import { usePortfolio } from '../context/PortfolioContext'
import { formatCurrency } from '../utils/formatCurrency'
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'

export default function Investments() {
  const {
    totalCost,
    pieChartData,
    setConvertCurrency,
    convertCurrency,
    gainOrLoss,
    individualGainOrLoss,
    monthlyData,
  } = usePortfolio()

  function handleToggleCurrency(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const selectedCurrency = (e.target as HTMLButtonElement).value
    setConvertCurrency(selectedCurrency)
  }

  const totalShares = pieChartData.reduce((a, c) => a + c.shares, 0)

  const assetValues = pieChartData.map((asset) => {
    return (
      <div key={asset.ticker} className="my-investments">
        <h1 className="investments-asset-name">{asset.name}</h1>
        <h1 className="investments-asset-value">
          {formatCurrency(asset.value, convertCurrency)}
        </h1>
        <h1 className="investments-asset-gain-or-loss">
          {individualGainOrLoss(asset.value, asset.cost)}
        </h1>
      </div>
    )
  })

  const formatTooltip = (value: number) => {
    return formatCurrency(value, convertCurrency)
  }

  return (
    <>
      <div className="app2">
        <Nav />
        <TopRightProfile />
        <div className="investments-wrapper">
          <div className="investments-heading-overview-wrapper">
            <h1 className="investments-heading">Investments</h1>
            <div className="total-investments-wrapper">
              <img
                className="dollar-sign-icon"
                alt="dollar-sign-icon"
                src="/images/hand-and-dollar-sign-icon.webp"
              ></img>
              <h1 className="total-investments-heading">Total Invested</h1>
              <h2 className="total-invested-value">
                {formatCurrency(totalCost, convertCurrency)}
              </h2>
            </div>
            <div className="number-of-investments-wrapper">
              <img
                className="stack-of-coins-icon"
                alt="stack-of-coins-icon"
                src="/images/stack-of-coins-icon.webp"
              ></img>
              <h1 className="number-of-investments-heading">
                No. of Investments
              </h1>
              <h1 className="number-of-investments-value">
                {totalShares.toFixed(2)}
              </h1>
            </div>
            <div className="rate-of-return-wrapper">
              <img
                className="rate-of-return-icon"
                alt="rate-of-return-icon"
                src="/images/rate-of-return-icon.webp"
              ></img>
              <h1 className="rate-of-return-heading">Rate of Return</h1>
              <h1 className="rate-of-return-value">{gainOrLoss()}</h1>
            </div>
          </div>
          <div className="yearly-total-revenue-wrapper">
            <h1 className="yearly-total-revenue-heading">
              Portfolio Value Over Time
            </h1>
            <div className="monthly-line-chart-data">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, '')} />
                  <Tooltip
                    formatter={(value: number) => formatTooltip(value)}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="my-investments-wrapper">
            <h1 className="my-investments-heading">My Investments</h1>
            {assetValues}
          </div>
          <div className="investments-buttons">
            <label htmlFor="toggle-currency" className="toggle-currency-label">
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
        </div>
      </div>
    </>
  )
}
