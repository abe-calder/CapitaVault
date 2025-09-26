import Nav from "./Nav";
import { useAuth0 } from "@auth0/auth0-react";

export default function Settings() {
  const { user } = useAuth0()

  return (
    <>
      <div className="app2">
        <Nav />
        <div className="settings-page-wrapper">
          <div className="profile-wrapper">
            <div className="profile">
              {user && (
                <img
                  alt="profile-photo"
                  src={user.picture}
                  className="profile-photo"
                ></img>
              )}
              {user && <h1 className="profile-name">{user.name}</h1>}
            </div>
          </div>
          <div className="settings-tabs-wrapper">
            <h1 className="settings-heading">Settings</h1>
            <label className="adjust-holdings-radio-input">
              <input
                type="radio"
                id="adjust-holdings"
                name="adjust-holdings"
                value="adjustholdings"
                className=""
              />
              Adjust Holdings
            </label>
            <label className="profile-settings-radio-input">
              <input
                type="radio"
                id="profile-settings"
                name="profile-settings"
                value="profilesettings"
                className=""
              />
              Profile Settings
            </label>
          </div>
          <div className="settings"></div>
        </div>
      </div>
    </>
  )
}