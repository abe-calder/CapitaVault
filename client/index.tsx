import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router/dom'
import { createBrowserRouter } from 'react-router'
import routes from './routes.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import '@radix-ui/themes/styles.css'


const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <Auth0Provider
      domain="dev-gy30iif5emo7oo31.au.auth0.com"
      clientId="qdmoDShTbBohQbm2tpQvJqX20IyXtjGb"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://capitavault/api',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Auth0Provider>,
  )
})
