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
import AdminLayout from '../features/admin/components/AdminLayout'
import AdminDashboardPage from '../features/admin/components/AdminDashboardPage'
import AuditLogsPage from '../features/admin/components/AuditLogsPage'
import StatementsPage from '../features/admin/components/StatementsPage'
import UserLookupPage from '../features/admin/components/UserLookupPage'
import AccountManagementPage from '../features/admin/components/AccountManagementPage'
import TransactionManagementPage from '../features/admin/components/TransactionManagementPage'
import ProfilePage from '../features/profile/components/ProfilePage'

// Placeholder page for teller role — replaced in a future sprint
const TellerPortalPage = () => (
  <div className="min-h-screen bg-app flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">
        Teller Portal
      </h1>
      <p className="text-text-secondary text-sm">Coming soon</p>
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
 *
 * OCP — new routes are added here without modifying existing route definitions.
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

        {/* Profile & Settings route — all authenticated roles */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={['ROLE_CUSTOMER', 'ROLE_TELLER', 'ROLE_ADMIN']}
            >
              <ProfilePage />
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

        {/* Admin protected routes — nested under /admin with shared AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <AuditLogsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/statements"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <StatementsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-lookup"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <UserLookupPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/account-management"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <AccountManagementPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transaction-management"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout>
                <TransactionManagementPage />
              </AdminLayout>
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