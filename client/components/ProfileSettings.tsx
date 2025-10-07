import { useAuth0 } from "@auth0/auth0-react";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser, useUsers } from "../hooks/useUsers";
import { UpdatedUser } from "../../models/users";

interface FormState {
  name: ''
  email: ''
  username: ''

}

const emptyForm: FormState = {
  name: '',
  email: '',
  username: '',
}

export default function ProfileSettings() {
  const { user, getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  const [formState, setFormState] = useState(emptyForm)
  const updateUserFn = useUpdateUser()

  useEffect(() => {
      const ws = new WebSocket('http://localhost:3000')
  
      ws.onopen = () => {
        console.log('Websocket Connected')
      }
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'database_change') {
          queryClient.invalidateQueries({ queryKey: ['users'] })
          queryClient.invalidateQueries({ queryKey: ['user'] })
        }
      }
  
      ws.onclose = () => {
        console.log('WebSocket Disconnected')
      }
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
  
      return () => ws.close()
    }, [queryClient])


  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
      evt.preventDefault()
      const token = await getAccessTokenSilently()
  
      
  
      const updatedUser = {
        name: formState.name,
        emai: formState.email,
        username: formState.username
      } as unknown as UpdatedUser
      await updateUserFn.mutateAsync({ updatedUser, token })
      setFormState(emptyForm)
    }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
      const { name, value } = evt.currentTarget
  
      setFormState((prev) => ({ ...prev, [name]: value }))
    }

  return (
    <>
      <Settings />
      <div className="profile-settings-wrapper">
        <h1 className="profile-settings-heading">Profile Settings</h1>
        <img
          style={{ width: '6vw', borderRadius: '3vw', top: '7vh', left: '0vw' }}
          className="profile-photo"
          alt="profile-image"
          src={user && user.picture}
        ></img>
        <form onSubmit={handleSubmit}>
          <label className="profile-form-label-name">
            Change Your Name:
            <input
              onChange={handleChange}
              id="name"
              name="name"
              value={formState.name}
              placeholder="Name"
              type="text"
              className="profile-form-label-name"
            ></input>
          </label>
          <label className="profile-form-label-email">
            Change Your Name:
            <input
              onChange={handleChange}
              id="email"
              name="email"
              value={formState.email}
              placeholder="Email"
              type="text"
              className="profile-form-label-email"
            ></input>
          </label>
          <label className="profile-form-label-username">
            Change Your username:
            <input
              onChange={handleChange}
              id="username"
              name="username"
              value={formState.username}
              placeholder="Username"
              type="text"
              className="profile-form-label-username"
            ></input>
          </label>
        </form>
      </div>
    </>
  )
}
