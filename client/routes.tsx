import { createRoutesFromElements, Route } from 'react-router'

import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Dashboard from './components/Dashboard.tsx'
import Settings from './components/Settings.tsx'
import AdjustHoldings from './components/AdjustHoldings.tsx'
import ProfileSettings from './components/ProfileSettings.tsx'
import Register from './components/Register.tsx'
import Investments from './components/Investments.tsx'



export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path='/register' element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/adjust-holdings" element={<AdjustHoldings />} />
    <Route path="/settings/profile-settings" element={<ProfileSettings />} />
    <Route path='/investments' element={<Investments />} />
  </Route>,
)
