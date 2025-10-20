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
          </div>
        </div>
      </div>
    </>
  )
}