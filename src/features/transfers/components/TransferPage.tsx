import { Link, useNavigate } from 'react-router-dom'
import { useMyAccounts } from '../../dashboard/hooks/useMyAccounts'
import { useAuthStore } from '../../../store/authStore'
import TransferForm from './TransferForm'
import Button from '../../../shared/components/Button'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the transfer page layout and delegates form logic
 * to TransferForm. It handles loading and empty states for accounts.
 */
const TransferPage = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { accounts, isLoading, isError } = useMyAccounts()

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  const handleTransferSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-app">

      {/* Top navigation bar */}
      <header className="bg-navy shadow-elevated">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center
                        justify-between">
          <h1 className="font-display text-xl font-semibold text-surface">
            HDFC NetBanking
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Dashboard
            </button>
            <span className="text-sm text-gray-300">
              Welcome, {user?.username}
            </span>
            <Button
              label="Sign Out"
              onClick={handleLogout}
              variant="secondary"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-lg mx-auto">

          {/* Loading state */}
          {isLoading && (
            <p className="text-sm text-text-muted">Loading accounts...</p>
          )}

          {/* Error state */}
          {isError && (
            <div
              role="alert"
              className="px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              Could not load accounts. Please try again later.
            </div>
          )}

          {/* Empty state — no accounts */}
          {!isLoading && !isError && accounts.length === 0 && (
            <p className="text-sm text-text-muted">
              No accounts available. Contact your bank to open an account.
            </p>
          )}

          {/* Transfer form */}
          {!isLoading && !isError && accounts.length > 0 && (
            <TransferForm
              accounts={accounts}
              onSuccess={handleTransferSuccess}
            />
          )}

          {/* Link to transaction history */}
          <div className="text-center mt-6">
            <Link
              to="/transactions"
              className="text-sm text-navy font-medium hover:text-gold
                         transition-colors duration-150"
            >
              View Transaction History
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TransferPage