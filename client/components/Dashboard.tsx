import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'

export default function Dashboard() {
  const { user } = useAuth0()

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
                    src="/home/abecalder/1projects/CapitaVault/public/images/profile-photo-fallback.webp"
                    alt="fallback-img"
                  ></img>
                </object>
              )}
              {user && <h1 className="profile-name">{user.name}</h1>}
            </div>
            <div className="holdings">
              <h1 className="holdings-heading">Holdings</h1>
              <div className="holdings-buttons">
                <label>
                  <input
                    type="radio"
                    id="all"
                    name="all"
                    value="all"
                    className="dashboard-radio-inputs"
                  />
                  All
                </label>
                <label>
                  <input
                    type="radio"
                    id="crypto"
                    name="crypto"
                    value="crypto"
                    className="dashboard-radio-inputs"
                  />
                  Crypto
                </label>
                <label>
                  <input
                    type="radio"
                    id="stocks-and-etfs"
                    name="stocks-and-etfs"
                    value="stocksandetfs"
                    className="dashboard-radio-inputs"
                  />
                  Stocks and ETFs
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
