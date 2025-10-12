import Nav from './Nav'
import { useUsers } from '../hooks/useUsers'
import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import AssetDistributionChart from './AssetDistributionChart'
import TopRightProfile from './TopRightProfile.tsx'
import { usePortfolio } from '../context/PortfolioContext.tsx'
import { useFxRatesContext } from '../context/FxRatesContext.tsx'

export default function Dashboard() {
  const getMe = useUsers()
  const { rates: fxRates } = useFxRatesContext()

  const {
    totalBalance,
    totalCost,
    pieChartData,
    // totalBalanceUsd,
    convertCurrency,
    setConvertCurrency,
    isLoading,
    error,
    gainOrLoss,
  } = usePortfolio()

  const userGoalData = useMemo(() => {
    const goal = getMe.data?.goal
    const goalCostString = getMe.data?.goalCost || '0USD'

    const costValue = parseFloat(goalCostString.replace(/[^0-9.]/g, ''))
    const currencyMatch = goalCostString.match(/[a-zA-Z]+/)
    const costCurrency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD'

    const toCurrency = convertCurrency.toUpperCase()
    const conversionRate = fxRates[toCurrency] / fxRates[costCurrency] || 1

    const convertedGoalCost = !isNaN(costValue) ? costValue * conversionRate : 0

    return {
      userGoal: goal,
      userGoalCost: convertedGoalCost,
    }
  }, [getMe.data, convertCurrency, fxRates])

  function handleToggleCurrency(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const selectedCurrency = (e.target as HTMLButtonElement).value
    setConvertCurrency(selectedCurrency)
  }
  const income = totalBalance - totalCost

  const formatCurrency = (value: number) => {
    return `${convertCurrency} ${value.toFixed(2)}`
  }

  const formatTooltip = (value: number) => {
    return `${convertCurrency} ${value.toFixed(2)}`
  }

  const assetDataValues = pieChartData.map((asset) => {
    return (
      <div className="asset-holdings-wrapper" key={asset.name}>
        <h1 className="asset-holdings-name">{asset.name}</h1>
        <div className="asset-holdings-shares">
          <p className="asset-holdings-value">{formatCurrency(asset.value)}</p>
          <p className="asset-shares">
            {asset.shares} {asset.ticker}
          </p>
        </div>
      </div>
    )
  })

  if (isLoading) {
    return <div>Loading Dashboard...</div>
  }

  if (error) {
    const errorMessage = error
    return <div>Error: {errorMessage}</div>
  }

  const oneQuarterBalance = (totalBalance / 8).toFixed(2)
  const oneHalfBalance = (totalBalance / 4).toFixed(2)
  const threeQuartersBalance = (totalBalance / 2).toFixed(2)
  const fullBalance = totalBalance.toFixed(2)

  const oneQuarterGoal =
    userGoalData.userGoalCost && Number(userGoalData.userGoalCost) / 4
  const oneHalfGoal =
    userGoalData.userGoalCost && Number(userGoalData.userGoalCost) / 2
  const threeQuartersGoal =
    userGoalData.userGoalCost && (Number(userGoalData.userGoalCost) * 3) / 4
  const fullGoal =
    userGoalData.userGoalCost && Number(userGoalData.userGoalCost)

  const lineData = [
    {
      name: '0',
      CurrentBalance: 0,
      pv: 0,
      goal: fullGoal,
    },
    {
      name: '1/4',
      CurrentBalance: oneQuarterBalance,
      uv: oneQuarterGoal,
      goal: fullGoal,
    },
    {
      name: '2/4',
      CurrentBalance: oneHalfBalance,
      uv: oneHalfGoal,
      goal: fullGoal,
    },
    {
      name: '3/4',
      CurrentBalance: threeQuartersBalance,
      uv: threeQuartersGoal,
      goal: fullGoal,
    },
    {
      name: '4/4',
      CurrentBalance: fullBalance,
      uv: fullGoal,
      goal: fullGoal,
    },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <>
      <div className="app2">
        <Nav />
        <TopRightProfile />
        <div className="dashboard-wrapper">
          <div className="heading-and-total-balance-wrapper">
            <h1 className="dashboard-heading">Dashboard</h1>
            <div className="total-balance">
              <h2 className="total-balance-heading">Total Balance</h2>
              <p className="total-balance-percentage-gain-or-loss">
                {gainOrLoss()}
              </p>
              <p className="total-balance-value">
                {convertCurrency} {totalBalance.toFixed(2)}
              </p>
              <div className="total-cost-value">
                <p className="total-cost-expense-p">&#8964; Expense</p>
                {convertCurrency} {totalCost.toFixed(2)}
                <h1 className="total-balance-divider"> | </h1>
                <p className="total-income-p">^ Income </p>
                <p className="total-income-value">
                  {convertCurrency} {income.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="statistics-wrapper">
            <div className="statistics">
              <h2 className="statistics-heading">Statistics</h2>
              {pieChartData.length > 0 && (
                <div className="pie-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="90%"
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
                        formatter={(value: number) => formatTooltip(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
          <div className="goals-wrapper">
            <div className="goals">
              <h1 className="goals-heading">Goals</h1>
              <h1 className="goals-sub-heading-user-goal">
                {userGoalData.userGoal}
              </h1>
              <h1 className="goals-sub-heading-user-goal-cost">
                <p>{totalBalance.toFixed(2)}</p>
                out of
                <p>{userGoalData && userGoalData.userGoalCost}</p>
              </h1>
              <div className="line-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="CurrentBalance"
                      stroke="#8884d8"
                    />
                    <Line type="monotone" dataKey="goal" stroke="#35c20aff" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="spending-wrapper">
            <div className="spending">
              <h2 className="spending-heading">Asset Distribution</h2>
              <div className="asset-distribution-chart">
                <AssetDistributionChart
                  data={pieChartData}
                  totalBalance={totalBalance}
                />
              </div>
            </div>
          </div>
          <div className="profile-and-holdings-wrapper">
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
