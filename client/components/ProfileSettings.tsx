import { useAuth0 } from "@auth0/auth0-react";
import Settings from "./Settings";

export default function ProfileSettings() {
  const { user } = useAuth0()
  return (
    <>
      <Settings />
      <div className="profile-settings-wrapper">
        <h1 className="profile-settings-heading">Profile Settings</h1>
        <img alt='user-profile-image' src={ user && user.picture}></img>
      </div>
    </>
  )
}
