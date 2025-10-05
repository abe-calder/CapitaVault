import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'
import { useGetAssets } from '../hooks/useAssets'
import { useUsers } from '../hooks/useUsers'
import { AssetData } from '../../models/assets'
import { useQuery } from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon'
import { Results } from '../../models/polygon'
import { useFxRates } from '../hooks/useFxrates'

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
  // const convert = useFxRates('USD', convertToCurrency, convertToValue)

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

  function handleToggleCurrency() {

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
                  <button className="toggle-currency-buttons" value="USD" name='USD' >
                    USD
                  </button>
                  <button className="toggle-currency-buttons" value="NZD" >
                    NZD
                  </button>
                  <button className="toggle-currency-buttons" value="AUD">
                    AUD
                  </button>
                  <button className="toggle-currency-buttons" value="EUR">
                    EUR
                  </button>
                  <button className="toggle-currency-buttons" value="GBP">
                    GBP
                  </button>
                </label>
              </div>
              <div className="holdings-display">
                {userAssetData.map((asset: AssetData) => {
                  const cleanTicker = asset.ticker
                    .replace(/^X:/, '')
                    .replace(/USD$/, '')
                  const assetData = resultsByTicker[cleanTicker]
                  return (
                    <div className="asset-holdings-wrapper" key={asset.id}>
                      <h1 className="asset-holdings-name">{asset.name}</h1>
                      <div className="asset-holdings-shares">
                        {assetData && assetData.results && (
                          <p className="asset-holdings-value">
                            $
                            {(assetData.results[0].c * asset.shares).toFixed(2)}
                          </p>
                        )}
                        <p className="asset-shares">
                          {asset.shares} {asset.ticker}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
