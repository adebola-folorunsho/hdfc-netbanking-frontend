import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found. Check index.html for a <div id="root">.')
}

createRoot(root).render(
  <StrictMode>
    <div className="text-2xl font-bold text-blue-600 p-8">
      HDFC NetBanking — Setup Complete
    </div>
  </StrictMode>
)