import { Theme } from '@radix-ui/themes'

import { Outlet } from 'react-router'
import { FxRatesProvider } from '../context/FxRatesContext.tsx'
import { PortfolioProvider } from '../context/PortfolioContext.tsx'

function App() {
  return (
    <>
      <div className="">
        <Theme>
          <FxRatesProvider>
            <PortfolioProvider>
              <Outlet />
            </PortfolioProvider>
          </FxRatesProvider>
        </Theme>
      </div>
    </>
  )
}

export default App
