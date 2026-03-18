import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSilentRefresh } from '../features/auth/hooks/useSilentRefresh'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/components/LoginPage'
import RegisterPage from '../features/auth/components/RegisterPage'
import TwoFactorPage from '../features/auth/components/TwoFactorPage'
import DashboardPage from '../features/dashboard/components/DashboardPage'
import TransferPage from '../features/transfers/components/TransferPage'
import TransactionHistoryPage from '../features/transfers/components/TransactionHistoryPage'
import CurrencyConverterPage from '../features/currency/components/CurrencyConverterPage'

// Placeholder pages for roles not yet built — replaced in Sprint 5
const TellerPortalPage = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">
        Teller Portal
      </h1>
      <p className="text-text-secondary text-sm">Coming soon — Sprint 5</p>
    </div>
  </div>
)

const AdminPortalPage = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">
        Admin Portal
      </h1>
      <p className="text-text-secondary text-sm">Coming soon — Sprint 5</p>
    </div>
  </div>
)

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">
        403 — Unauthorized
      </h1>
      <p className="text-text-secondary text-sm">
        You are not authorised to view this page.
      </p>
    </div>
  </div>
)

const NotFoundPage = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">
        404 — Not Found
      </h1>
      <p className="text-text-secondary text-sm">
        The page you are looking for does not exist.
      </p>
    </div>
  </div>
)

/*
 * Pattern: Composition Root (SRP — Single Responsibility Principle)
 * This component owns the route tree and nothing else.
 * All route guards, redirects, and role-based routing are configured here.
 */
const AppRouter = () => {
  const { isResolved } = useSilentRefresh()

  // Block rendering until silent refresh attempt is complete
  if (!isResolved) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-app">
        <p className="text-text-muted text-sm">Loading...</p>
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

        {/* Customer protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Transfer routes */}
        <Route
          path="/transfer"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <TransferPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <TransactionHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Currency converter route */}
        <Route
          path="/currency"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
              <CurrencyConverterPage />
            </ProtectedRoute>
          }
        />

        {/* Teller protected routes */}
        <Route
          path="/teller"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TELLER']}>
              <TellerPortalPage />
            </ProtectedRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminPortalPage />
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