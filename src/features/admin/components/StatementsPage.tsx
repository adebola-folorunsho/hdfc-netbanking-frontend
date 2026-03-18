import { useState } from 'react'
import { useStatementsByUser } from '../hooks/useStatementsByUser'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the statements search page UI and delegates
 * all data fetching to useStatementsByUser.
 * No API calls, no business logic — all of that lives in the hook.
 */

const PAGE_SIZE = 10

/**
 * Admin page for looking up monthly statements by user ID.
 * The admin enters a numeric user ID and submits — results are
 * displayed in a paginated table.
 */
const StatementsPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [submittedUserId, setSubmittedUserId] = useState(0)
  const [page, setPage] = useState(0)
  const [inputError, setInputError] = useState('')

  const { statements, totalPages, totalElements, isLoading, isError } =
    useStatementsByUser({ userId: submittedUserId, page, size: PAGE_SIZE })

  const handleSearch = () => {
    const parsed = parseInt(inputValue.trim(), 10)

    // Validate — user ID must be a positive integer
    if (!inputValue.trim() || isNaN(parsed) || parsed <= 0) {
      setInputError('Please enter a valid numeric user ID.')
      return
    }

    setInputError('')
    setSubmittedUserId(parsed)
    // Reset to first page on new search
    setPage(0)
  }

  const hasSearched = submittedUserId > 0

  return (
    <div className="animate-enter">

      {/* Page heading */}
      <h2 className="font-display text-2xl font-semibold text-navy mb-2">
        Statements
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        Look up monthly account statements by user ID.
      </p>

      {/* Search form */}
      <div className="bg-surface rounded-xl shadow-card p-6 border
                      border-gray-100 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <InputField
              id="userId"
              label="User ID"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 123"
              error={inputError}
              autoComplete="off"
            />
          </div>
          <div className="mb-0.5">
            <Button
              label="Search"
              onClick={handleSearch}
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* Pre-search prompt */}
      {!hasSearched && (
        <p className="text-sm text-text-muted">
          Enter a user ID to search for their statements.
        </p>
      )}

      {/* Loading state */}
      {hasSearched && isLoading && (
        <p className="text-sm text-text-muted">Loading statements...</p>
      )}

      {/* Error state */}
      {hasSearched && isError && (
        <div
          role="alert"
          className="px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          Could not load statements. Please try again later.
        </div>
      )}

      {/* Empty state */}
      {hasSearched && !isLoading && !isError && statements.length === 0 && (
        <p className="text-sm text-text-muted">
          No statements found for user ID {submittedUserId}.
        </p>
      )}

      {/* Statements table */}
      {hasSearched && !isLoading && !isError && statements.length > 0 && (
        <>
          <p className="text-sm text-text-secondary mb-4">
            {totalElements} {totalElements === 1 ? 'statement' : 'statements'}{' '}
            found for user ID {submittedUserId}
          </p>

          <div className="bg-surface rounded-xl shadow-card overflow-hidden
                          border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium
                                 text-text-muted uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium
                                 text-text-muted uppercase tracking-wider">
                    Account ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium
                                 text-text-muted uppercase tracking-wider">
                    Period
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium
                                 text-text-muted uppercase tracking-wider">
                    Generated At
                  </th>
                </tr>
              </thead>
              <tbody>
                {statements.map((statement) => (
                  <tr
                    key={statement.id}
                    className="border-b border-gray-50 hover:bg-gray-50
                               transition-colors duration-100"
                  >
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {statement.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary
                                   font-mono">
                      {statement.accountId}
                    </td>
                    <td className="py-3 px-4 text-sm text-navy">
                      {statement.periodStart} → {statement.periodEnd}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary
                                   whitespace-nowrap">
                      {new Date(statement.generatedAt).toLocaleString(
                        'en-NG',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-secondary">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-input border border-gray-200
                             text-sm font-medium text-navy
                             hover:border-navy transition-colors duration-150
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-input border border-gray-200
                             text-sm font-medium text-navy
                             hover:border-navy transition-colors duration-150
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StatementsPage