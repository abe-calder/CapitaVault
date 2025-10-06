import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'
import { useGetAssets } from '../hooks/useAssets'
import { useUsers } from '../hooks/useUsers'
import { AssetData } from '../../models/assets'
import { useQuery } from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon'
import { Results } from '../../models/polygon'
import { useFxRates } from '../hooks/useFxrates'
import { useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth0()
  const getMe = useUsers()
  const userId = getMe.data?.id
  const userAssets = useGetAssets(userId as number)
  const userAssetData = userAssets.data
  const { data, isLoading, error } = useQuery({
    queryKey: ['myItemsData', userAssetData],
    queryFn: () => getAssetDataByTicker(userAssetData),
  })
  const [convertToCurrency, setConvertToCurrency] = useState('NZD')
  const [currencyAmount, setCurrencyAmount] = useState(1)
  const convert = useFxRates('USD', convertToCurrency, currencyAmount)

  if (userAssets.isPending) {
    return
  }
  if (userAssets.isError) {
    return
  }

  if (isLoading) {
    return <div>Loading....</div>
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>
  }

  const resultsByTicker: Record<string, Results> = {}
  if (data) {
    data.forEach((asset: any) => {
      if (asset && asset.ticker) {
        resultsByTicker[asset.ticker.replace(/^X:/, '').replace(/USD$/, '')] =
          asset
      }
    })
  }

  function handleToggleCurrency(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const selectedCurrency = (e.target as HTMLButtonElement).value
    setConvertToCurrency(selectedCurrency)
  }

  const isFxLoading = convert.isLoading
  const isFxError = convert.isError
  const fxRate =
    typeof convert.data?.result === 'number' ? convert.data.result : null

  const assetDataValues = userAssetData.map((asset: AssetData) => {
    const cleanTicker = asset.ticker.replace(/^X:/, '').replace(/USD$/, '')
    const assetData = resultsByTicker[cleanTicker]
    return (
      <div className="asset-holdings-wrapper" key={asset.id}>
        <h1 className="asset-holdings-name">{asset.name}</h1>
        <div className="asset-holdings-shares">
          {assetData && assetData.results && (
            <p className="asset-holdings-value">
              {convertToCurrency === 'USD'
                ? `$${(assetData.results[0].c * asset.shares).toFixed(2)}`
                : isFxLoading
                  ? 'Loading FX...'
                  : isFxError
                    ? 'FX Error'
                    : fxRate
                      ? `${convertToCurrency} ${(assetData.results[0].c * asset.shares * fxRate).toFixed(2)}`
                      : 'No FX rate'}
            </p>
          )}
          <p className="asset-shares">
            {asset.shares} {asset.ticker}
          </p>
        </div>
      </div>
    )
  })
  // const totalBalance =  
  let totalBalance = 0
  let totalCost = 0
  if (userAssetData && data) {
    userAssetData.forEach((asset: AssetData) => {
      const cleanTicker = asset.ticker.replace(/^X:/, '').replace(/USD$/, '')
      const assetData = resultsByTicker[cleanTicker]
      if (assetData && assetData.results && assetData.results[0]) {
        const usdValue = assetData.results[0].c * asset.shares
        if (convertToCurrency === 'USD') {
          totalBalance += usdValue
        } else if (fxRate) {
          totalBalance += usdValue * fxRate
        }
         totalCost +=
          Number(asset.cost) * Number(asset.shares)
        // You can use totalCost if needed

      }
    })
  }

  return (
    <>
      <div className="app2">
        <Nav />
        <div className="dashboard-wrapper">
          <div className="heading-and-total-balance-wrapper">
            <h1 className="dashboard-heading">Dashboard</h1>
            <div className="total-balance">
              <h2 className="total-balance-heading">Total Balance</h2>
              <p className='total-balance-value'>
                {convertToCurrency === 'USD'
                  ? `$${totalBalance.toFixed(2)}`
                  : isFxLoading
                    ? 'Loading FX...'
                    : isFxError
                      ? 'FX Error'
                      : fxRate
                        ? `${convertToCurrency} ${totalBalance.toFixed(2)}`
                        : 'No FX rate'}
              </p>
              <p>{convertToCurrency === 'USD'
                  ? `$${totalCost.toFixed(2)}`
                  : isFxLoading
                    ? 'Loading FX...'
                    : isFxError
                      ? 'FX Error'
                      : fxRate
                        ? `${convertToCurrency} ${totalCost.toFixed(2)}`
                        : 'No FX rate'}</p>
            </div>
          </div>
          <div className="statistics-wrapper">
            <div className="statistics">
              <h2 className="statistics-heading">Statistics</h2>
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
