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
    auth0Id: user?.sub ?? '',
    goal: user?.goal ?? '' as string,
    goalCost: user?.goalCost ?? '' as string,
  })

  useEffect(() => {
    if (userHook.data) navigate('/')
  }, [userHook.data, navigate])

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        auth0Id: user.sub ?? (prevForm.auth0Id as string),
        email: user.email ?? (prevForm.email as string),
        name: user.name ?? (prevForm.name as string),
        username: user.nickname ?? (prevForm.username as string),
        goal: user.goal ?? (prevForm.goal as string),
        goalCost: user.goalCost ?? (prevForm.goalCost as string),
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
              <label className="username-label rfl" htmlFor="playerTag">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="username-input rfi"
                placeholder="Username"
              />

              <label className="email-label rfl" htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="email-input rfi"
                placeholder="Email"
              />
              <label className="name-label rfl" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="name-input rfi"
                placeholder="Name"
              />
              <label className="goal-label rfl" htmlFor="goal">
                Goal:
              </label>
              <input
                type="text"
                id="goal"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="goal-input rfi"
                placeholder="Goal"
              />
              <label className="goal-cost-label rfl" htmlFor="goalCost">
                Goal Cost:
              </label>
              <input
                type="text"
                id="goalCost"
                name="goalCost"
                onChange={handleChange}
                className="goal-cost-input rfi"
                placeholder="100000NZD"
                value={form.goalCost}
              />
            </div>
            <div>
              <button className="register-button rfsb" disabled={!form.auth0Id}>
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
