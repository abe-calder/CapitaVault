import { Theme } from '@radix-ui/themes'

import { Outlet } from 'react-router'
import { FxRatesProvider } from '../context/FxRatesContext.tsx'
import { PolygonDataProvider } from '../context/PolygonDataContext.tsx'

function App() {
  return (
    <>
      <div className="">
        <Theme>
          <FxRatesProvider>
            <PolygonDataProvider>
              <Outlet />
            </PolygonDataProvider>
          </FxRatesProvider>
        </Theme>
      </div>
    </>
  )
}

export default App
