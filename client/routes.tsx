import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App.tsx'
export default createRoutesFromElements(<Route index element={<App />} />)
