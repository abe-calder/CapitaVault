import Nav from './Nav'
import TopRightProfile from './TopRightProfile'
import { usePortfolio } from '../context/PortfolioContext'

export default function Investments() {
  const { totalCost, pieChartData, setConvertCurrency, convertCurrency, gainOrLoss, individualGainOrLoss } = usePortfolio()
  
  function handleToggleCurrency(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const selectedCurrency = (e.target as HTMLButtonElement).value
    setConvertCurrency(selectedCurrency)
  }

  const totalShares = pieChartData.reduce((a, c) => a + c.shares, 0)

  
  
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
                {convertCurrency} {totalCost.toFixed(2)}
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
              <h1 className="rate-of-return-value">{gainOrLoss}</h1>
            </div>
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
