import { Link } from "react-router";
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
            <Link
              to="/settings/adjust-holdings"
              className="adjust-holdings-link"
            >
              Adjust Holdings
            </Link>
            <Link
              to="/settings/profile-settings"
              className="profile-settings-link"
            >
              Profile Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}