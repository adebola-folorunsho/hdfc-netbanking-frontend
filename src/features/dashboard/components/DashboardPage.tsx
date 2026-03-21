import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { useMyAccounts } from '../hooks/useMyAccounts'
import { useMyTransactions } from '../hooks/useMyTransactions'
import AccountCard from './AccountCard'
import TransactionRow from './TransactionRow'
import Button from '../../../shared/components/Button'
import CurrencyRateWidget from '../../currency/components/CurrencyRateWidget'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the dashboard layout and delegates all data fetching
 * to useMyAccounts and useMyTransactions hooks.
 * No API calls, no business logic — all of that lives in the hooks.
 */
const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const {
    accounts,
    isLoading: accountsLoading,
    isError: accountsError,
  } = useMyAccounts()

  const {
    transactions: allTransactions,
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useMyTransactions()

  // Dashboard shows only the 5 most recent transactions
  // Full history is available on the dedicated transaction history page
  const recentTransactions = allTransactions.slice(0, 5)

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
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
              onClick={() => navigate('/transfer')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Transfer
            </button>
            <button
              type="button"
              onClick={() => navigate('/currency')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Currency
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Profile
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

        {/* Accounts section */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-navy mb-6">
            My Accounts
          </h2>

          {/* Loading state */}
          {accountsLoading && (
            <p className="text-sm text-text-muted">Loading accounts...</p>
          )}

          {/* Error state */}
          {accountsError && (
            <div
              role="alert"
              className="px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              Could not load accounts. Please try again later.
            </div>
          )}

          {/* Empty state */}
          {!accountsLoading && !accountsError && accounts.length === 0 && (
            <p className="text-sm text-text-muted">
              No accounts found. Contact your bank to open an account.
            </p>
          )}

          {/* Account cards grid */}
          {!accountsLoading && !accountsError && accounts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                            gap-6">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </section>

        {/* Currency rate widget section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurrencyRateWidget />
          </div>
        </section>

        {/* Transactions section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Recent Transactions
            </h2>
          </div>

          {/* Loading state */}
          {transactionsLoading && (
            <p className="text-sm text-text-muted">
              Loading transactions...
            </p>
          )}

          {/* Error state */}
          {transactionsError && (
            <div
              role="alert"
              className="px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              Could not load transactions. Please try again later.
            </div>
          )}

          {/* Empty state */}
          {!transactionsLoading && !transactionsError &&
            recentTransactions.length === 0 && (
            <p className="text-sm text-text-muted">
              No transactions found.
            </p>
          )}

          {/* Transactions table */}
          {!transactionsLoading && !transactionsError &&
            recentTransactions.length > 0 && (
            <div className="bg-surface rounded-xl shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-medium
                                   text-text-muted uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium
                                   text-text-muted uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium
                                   text-text-muted uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium
                                   text-text-muted uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Link to full transaction history */}
          {!transactionsLoading && !transactionsError && (
            <div className="text-center mt-4">
              <Link
                to="/transactions"
                className="text-sm text-navy font-medium hover:text-gold
                           transition-colors duration-150"
              >
                View all transactions →
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage