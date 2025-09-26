import { IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'

export default function Home() {
  const { loginWithRedirect } = useAuth0()

  const handleSignIn = () => {
    loginWithRedirect({
      authorizationParams: {
        redirectUri: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <>
      <div className="app">
        <IfNotAuthenticated>
          <img
            alt="mini-CapitaVault-logo"
            className="mini-sign-in-page-logo"
            src="/images/CapitaVault-logo.webp"
          ></img>
          <div className="sign-in-page-logo-wrapper">
            <img
              alt="CapitaVault-logo"
              className="sign-in-page-logo"
              src="/images/CapitaVault-logo.webp"
            ></img>
            <h1 className="sign-in-page-heading">
              CapitaVault is an <br></br> investment portfolio <br></br> made
              easy
            </h1>
            <p className="sign-in-page-sub-heading">
              All your Crypto, shares and other <br></br> holdings, held easily
              in one place.
            </p>
          </div>
          <div className="sign-in-wrapper">
            <button className="sign-in-button" onClick={handleSignIn}>
              Log In
            </button>
            <h1 className="sign-in-message">
              Please press log in to view or <br></br> create your investment
              portfolio
            </h1>
          </div>
        </IfNotAuthenticated>
      </div>
    </>
  )
}
