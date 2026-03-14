import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppRouter from './routes/AppRouter'

// TanStack Query client — configured once and provided to the entire app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry failed requests automatically in most cases —
      // let the UI show the error immediately so the user can act
      retry: 1,
      // Data is considered stale after 30 seconds —
      // balances freshness with unnecessary refetches
      staleTime: 30_000,
    },
  },
})

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found. Check index.html for a <div id="root">.')
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>
)