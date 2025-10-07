import { Link } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import { IfAuthenticated } from './Authenticated'

export default function Nav() {
  const { logout } = useAuth0()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <div className="nav">
        <h1 className="nav-heading">CapitaVault</h1>
        <nav>
          <IfAuthenticated>
            <Link to="/dashboard" className="page-link dashboard-link">
              <img
                className="mini-house-icon"
                alt="dashboard-house-icon"
                src="/images/house-dashboard-icon.webp"
              ></img>
              Dashboard
            </Link>
            <Link to="/investments" className="page-link investments-link">
              <img
                className="mini-chart-icon"
                alt="investment-chart-icon"
                src="/images/investment-chart-icon.webp"
              ></img>
              Investments
            </Link>
            <Link
              to="/adjust-holdings"
              className="page-link adjust-holdings-link"
            >
              <img
                alt="adjust-holdings-icon"
                className="mini-adjust-holdings-icon"
                src="/images/adjust-holdings-link-image.webp"
              ></img>
              Adjust Holdings
            </Link>
            <Link to="/settings/profile-settings" className="settings-link">
              <img
                alt="settings-icon"
                className="mini-settings-icon"
                src="/images/user-settings.webp"
              ></img>
              Settings
            </Link>

            <button className="log-out-button" onClick={() => handleSignOut()}>
              <img
                alt="log-out-icon"
                src="/images/log-out-icon-.webp"
                className="mini-log-out-icon"
              ></img>
              Log-Out
            </button>
          </IfAuthenticated>
        </nav>
      </div>
    </>
  )
}
