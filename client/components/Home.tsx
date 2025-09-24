import { Heading } from '@radix-ui/themes'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'

export default function Home() {
  const { logout, loginWithRedirect, user } = useAuth0()

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect({
      authorizationParams: {
        redirectUri: `${window.location.origin}/login`,
      },
    })
  }

  return (
    <>
      <div className="app">
        <IfAuthenticated>
          <h1>Welcome!</h1>
        </IfAuthenticated>
        <IfNotAuthenticated>
          <div className='sign-in-wrapper'>
            <button className="sign-in-button" onClick={handleSignIn}>
              Log In
            </button>
            <h1 className="sign-in-message">Please</h1>
          </div>
        </IfNotAuthenticated>
      </div>
    </>
  )
}
