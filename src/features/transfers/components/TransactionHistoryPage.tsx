import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyAccounts } from '../../dashboard/hooks/useMyAccounts'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import TransactionRow from '../../dashboard/components/TransactionRow'
import Button from '../../../shared/components/Button'
import { useAuthStore } from '../../../store/authStore'
import type { Transaction } from '../../dashboard/types/dashboard.types'

// Transaction type options for the filter dropdown
const TRANSACTION_TYPE_OPTIONS: {
  value: Transaction['type'] | ''
  label: string
}[] = [
  { value: '', label: 'All Types' },
  { value: 'INTERNAL_TRANSFER', label: 'Internal Transfer' },
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'PAYSTACK_PAYMENT', label: 'Paystack Payment' },
]

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the transaction history page layout.
 * It delegates data fetching to useMyAccounts and useTransactionHistory.
 * No API calls, no business logic — all of that lives in the hooks.
 */
const TransactionHistoryPage = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const { accounts, isLoading: accountsLoading } = useMyAccounts()
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')

  // Use the first account by default once accounts load
  const effectiveAccountId = selectedAccountId || accounts[0]?.id || ''

  const {
    transactions,
    isLoading: transactionsLoading,
    isError: transactionsError,
    currentPage,
    totalPages,
    totalElements,
    isFirstPage,
    isLastPage,
    setTypeFilter,
    goToNextPage,
    goToPreviousPage,
  } = useTransactionHistory({ accountId: effectiveAccountId })

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
        <h2 className="font-display text-2xl font-semibold text-navy mb-6">
          Transaction History
        </h2>

        {/* Filters bar */}
        <div className="bg-surface rounded-xl shadow-card px-6 py-4 mb-6
                        flex flex-col sm:flex-row gap-4">

          {/* Account selector */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label
              htmlFor="selectedAccount"
              className="text-xs font-medium text-text-muted uppercase
                         tracking-wider"
            >
              Select Account
            </label>
            <select
              id="selectedAccount"
              value={effectiveAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              disabled={accountsLoading}
              className="w-full px-4 py-2.5 rounded-input border border-gray-200
                         text-sm font-body bg-surface text-navy
                         focus:outline-none focus:ring-2 focus:ring-gold
                         focus:border-transparent transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} ({account.accountType})
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label
              htmlFor="typeFilter"
              className="text-xs font-medium text-text-muted uppercase
                         tracking-wider"
            >
              Filter by Type
            </label>
            <select
              id="typeFilter"
              onChange={(e) => {
                const value = e.target.value as Transaction['type'] | ''
                setTypeFilter(value === '' ? undefined : value)
              }}
              className="w-full px-4 py-2.5 rounded-input border border-gray-200
                         text-sm font-body bg-surface text-navy
                         focus:outline-none focus:ring-2 focus:ring-gold
                         focus:border-transparent transition-colors duration-150"
            >
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary */}
        {!transactionsLoading && !transactionsError && (
          <p className="text-sm text-text-muted mb-4">
            {totalElements} transaction{totalElements !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Loading state */}
        {transactionsLoading && (
          <p className="text-sm text-text-muted">Loading transactions...</p>
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
          transactions.length === 0 && (
          <p className="text-sm text-text-muted">
            No transactions found for this account.
          </p>
        )}

        {/* Transactions table */}
        {!transactionsLoading && !transactionsError &&
          transactions.length > 0 && (
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
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3
                              border-t border-gray-100">
                <p className="text-xs text-text-muted">
                  Page {currentPage + 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    label="Previous"
                    onClick={goToPreviousPage}
                    disabled={isFirstPage}
                    variant="secondary"
                  />
                  <Button
                    label="Next"
                    onClick={goToNextPage}
                    disabled={isLastPage}
                    variant="secondary"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default TransactionHistoryPage