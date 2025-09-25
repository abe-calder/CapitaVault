import { createRoutesFromElements, Route } from 'react-router'

import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Dashboard from './components/Dashboard.tsx'


export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path='/dashboard' element={<Dashboard />} />
  </Route>,
)
