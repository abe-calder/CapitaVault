import { useAuth0 } from "@auth0/auth0-react";
import Settings from "./Settings";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "../hooks/useUsers";
import { UpdatedUser } from "../../models/users";

interface FormState {
  name: ''
  email: ''
  username: ''
  goal: ''
  goalCost: ''
}

const emptyForm: FormState = {
  name: '',
  email: '',
  username: '',
  goal: '',
  goalCost: ''
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
        username: formState.username,
        goal: formState.goal,
        goalCost: formState.goalCost
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
          style={{
            width: '6vw',
            borderRadius: '3vw',
            top: '5vh',
            left: '15vw',
          }}
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
              className="profile-form-input-name"
            ></input>
          </label>
          <label className="profile-form-label-email">
            Change Your Email:
            <input
              onChange={handleChange}
              id="email"
              name="email"
              value={formState.email}
              placeholder="Email"
              type="text"
              className="profile-form-input-email"
              required
            ></input>
          </label>
          <label className="profile-form-label-username">
            Change Your Username:
            <input
              onChange={handleChange}
              id="username"
              name="username"
              value={formState.username}
              placeholder="Username"
              type="text"
              className="profile-form-input-username"
              required
            ></input>
          </label>
          <label className="profile-form-label-goal">
            Change Your Goal:
            <input
              onChange={handleChange}
              id="goal"
              name="goal"
              value={formState.goal}
              placeholder="Goal"
              type="text"
              className="profile-form-input-goal"
              required
            ></input>
          </label>
          <label className="profile-form-label-goal-cost">
            Change Your Goal $ Value:
            <input
              onChange={handleChange}
              id="goalCost"
              name="goalCost"
              value={formState.goalCost}
              placeholder="100000NZD"
              type="text"
              className="profile-form-input-goal-cost"
              required
            ></input>
          </label>
          <button
            data-pending={updateUserFn.isPending}
            className="profile-form-submit-button"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
