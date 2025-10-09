import { Link } from "react-router";
import Nav from "./Nav";
import TopRightProfile from "./TopRightProfile";

export default function Settings() {

  return (
    <>
      <div className="app2">
        <Nav />
        <TopRightProfile />
        <div className="settings-page-wrapper">
          <div className="settings-tabs-wrapper">
            <h1 className="settings-heading">Settings</h1>
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