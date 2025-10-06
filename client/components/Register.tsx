import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth0 } from '@auth0/auth0-react'
import { useUsers } from '../hooks/useUsers.ts'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'

function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { getAccessTokenSilently, user } = useAuth0()
  const userHook = useUsers()

  const handleMutationSuccess = () => {
    navigate('/')
    setErrorMsg('')
  }

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setErrorMsg(error.message)
    } else {
      setErrorMsg('Unknown error')
    }
  }

  const mutationOptions = {
    onSuccess: handleMutationSuccess,
    onError: handleError,
  }

  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: user?.email ?? '',
    name: user?.name ?? '',
    auth0Id: user?.sub,
  })

  useEffect(() => {
    if (userHook.data) navigate('/')
  }, [userHook.data, navigate])

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        auth0Id: user.sub,
        email: user.email ?? prevForm.email,
        name: user.name ?? prevForm.name,
      }))
    }
  }, [user])

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    })
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (!form.auth0Id) {
      setErrorMsg('Could not get user ID. Please try signing in again.')
      return
    }
    const token = await getAccessTokenSilently()
    userHook.add.mutate({ newUser: form, token }, mutationOptions)
  }

  const hideError = () => {
    setErrorMsg('')
  }

  return (
    <div className="app2">
      <div className="register-form">
        <IfAuthenticated>
          <h1 className="register-heading">Enter your details</h1>
          <p></p>
          {errorMsg && (
            <div>
              Error: {errorMsg}
              <button onClick={hideError}>Okay</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="username-label" htmlFor="playerTag">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="username-input"
              />

              <label className="email-label" htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="email-input"
              />
              <label className="name-label" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="name-input"
              />
            </div>
            <div>
              <button className="register-button" disabled={!form.auth0Id}>
                Register
              </button>
            </div>
          </form>
        </IfAuthenticated>
        <IfNotAuthenticated>
          <h1>Please sign in</h1>
        </IfNotAuthenticated>
      </div>

      <img
        alt="mini-CapitaVault-logo"
        className="mini-sign-in-page-logo"
        src="/images/CapitaVault-logo.webp"
      ></img>
    </div>
  )
}

export default Register
