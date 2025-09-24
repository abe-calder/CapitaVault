import { Theme } from "@radix-ui/themes"

import { Outlet } from "react-router"

function App() {
  return (
    <>
      <div className="">
        <Theme>
          <Outlet />
        </Theme>
      </div>
    </>
  )
}

export default App
