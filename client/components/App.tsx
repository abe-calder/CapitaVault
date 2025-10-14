import { Theme } from '@radix-ui/themes'

import { Outlet } from 'react-router'
import { FxRatesProvider } from '../context/FxRatesContext.tsx'
import { PortfolioProvider } from '../context/PortfolioContext.tsx'
import { MarketHolidaysProvider } from '../context/MarketHolidaysContext.tsx'


function App() {
  return (
    <>
      <div className="">
        <Theme>
          <FxRatesProvider>
            <PortfolioProvider>
              <MarketHolidaysProvider>
                <Outlet />
              </MarketHolidaysProvider>
            </PortfolioProvider>
          </FxRatesProvider>
        </Theme>
      </div>
    </>
  )
}

export default App
