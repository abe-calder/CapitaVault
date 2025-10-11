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
          </div>
        </div>
      </div>
    </>
  )
}