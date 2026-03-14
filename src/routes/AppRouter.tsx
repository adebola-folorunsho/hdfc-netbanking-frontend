import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSilentRefresh } from '../features/auth/hooks/useSilentRefresh'
import ProtectedRoute from './ProtectedRoute'

// Auth pages — to be built next
import LoginPage from '../features/auth/components/LoginPage'
import RegisterPage from '../features/auth/components/RegisterPage'
import TwoFactorPage from '../features/auth/components/TwoFactorPage'

// Placeholder pages — will be replaced in later sprints
const DashboardPage = () => (
  <div className="p-8 text-xl font-semibold">Dashboard — Sprint 2</div>
)
const UnauthorizedPage = () => (
  <div className="p-8 text-xl font-semibold text-red-600">
    403 — You are not authorised to view this page.
  </div>
)
const NotFoundPage = () => (
  <div className="p-8 text-xl font-semibold text-gray-600">
    404 — Page not found.
  </div>
)

/*
 * Pattern: Composition Root (SRP — Single Responsibility Principle)
 * This component owns the route tree and nothing else.
 * All route guards, redirects, and lazy loading are configured here.
 * No business logic, no data fetching, no UI beyond structural layout.
 */
const AppRouter = () => {
  const { isResolved } = useSilentRefresh()

  // Block rendering until the silent refresh attempt is complete.
  // Without this, authenticated users get bounced to /login on every
  // page refresh before the access token is restored.
  if (!isResolved) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/2fa" element={<TwoFactorPage />} />

        {/* Protected routes — any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Utility routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter