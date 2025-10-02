import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth0 } from '@auth0/auth0-react'
import { useUsers } from '../hooks/useUsers.ts'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'

function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { getAccessTokenSilently } = useAuth0()
  const user = useUsers()

  const handleMutationSuccess = () => {
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
  })

  useEffect(() => {
    if (user.data) navigate('/')
  }, [user.data, navigate])

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    })
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    const token = await getAccessTokenSilently()
    evt.preventDefault()
    user.add.mutate({ newUser: form, token }, mutationOptions)
    navigate('/')
  }

  const hideError = () => {
    setErrorMsg('')
  }

  return (
    <div className='app2'>
      <div>
        <IfAuthenticated>
          <h1>Enter your Username</h1>
          <p></p>
          {errorMsg && (
            <div>
              Error: {errorMsg}
              <button onClick={hideError}>Okay</button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="playerTag">Username:</label>
              <input
                type="text"
                id="playerTag"
                name="playerTag"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <button>Register</button>
            </div>
          </form>
        </IfAuthenticated>
        <IfNotAuthenticated>
          <h1>Please sign in</h1>
        </IfNotAuthenticated>
      </div>
    </div>
  )
}

export default Register
