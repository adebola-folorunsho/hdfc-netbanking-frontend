import { useState } from 'react'
import { useAccountManagement } from '../hooks/useAccountManagement'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import type { UpdateAccountStatusRequest } from '../types/admin.types'
import Button from '../../../shared/components/Button'
import InputField from '../../../shared/components/InputField'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the account management page UI and delegates
 * all data fetching and mutations to useAccountManagement.
 * Local state owns only the search input, validation error, and
 * the status update form state.
 */
const AccountManagementPage = () => {
  const [searchInput, setSearchInput] = useState('')
  const [userId, setUserId] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  )
  const [newStatus, setNewStatus] =
    useState<UpdateAccountStatusRequest['status']>('ACTIVE')
  const [reason, setReason] = useState('')

  const {
    accounts,
    isLoading,
    isError,
    isSuccess,
    isMutating,
    mutationError,
    updateStatus,
  } = useAccountManagement(userId)

  const handleSearch = () => {
    const parsed = parseInt(searchInput.trim(), 10)
    if (!searchInput.trim() || isNaN(parsed) || parsed <= 0) {
      setValidationError('Please enter a valid user ID')
      return
    }
    setValidationError(null)
    setUserId(parsed)
  }

  const handleUpdateStatus = async (accountId: number) => {
    await updateStatus(accountId, { status: newStatus, reason })
    setSelectedAccountId(null)
    setReason('')
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-navy mb-6">
        Account Management
      </h2>

      {/* Search bar */}
      <div className="bg-surface rounded-xl shadow-card px-6 py-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <InputField
              id="userId"
              label="User ID"
              type="number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter user ID"
              error={validationError ?? undefined}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          <Button
            label="Search"
            onClick={handleSearch}
            isLoading={isLoading}
            loadingLabel="Searching..."
            disabled={isLoading}
          />
        </div>
      </div>

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
          Could not load accounts. Please check the user ID and try again.
        </div>
      )}

      {/* Mutation error */}
      {mutationError && (
        <div
          role="alert"
          className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          {mutationError}
        </div>
      )}

      {/* Empty state */}
      {isSuccess && accounts.length === 0 && (
        <p className="text-sm text-text-muted">
          No accounts found for this user.
        </p>
      )}

      {/* Accounts table */}
      {isSuccess && accounts.length > 0 && (
        <div className="bg-surface rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Account Number
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Balance
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-gray-100 hover:bg-gray-50
                             transition-colors duration-100"
                >
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-navy">
                      {account.accountNumber}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-text-secondary">
                      {account.accountType}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-semibold text-navy">
                      {formatCurrency(account.balance, account.currencyCode)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${account.accountStatus === 'ACTIVE'
                          ? 'bg-green-50 text-success'
                          : account.accountStatus === 'FROZEN'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-text-muted'
                        }`}
                    >
                      {account.accountStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      label="Update Status"
                      onClick={() =>
                        setSelectedAccountId(
                          selectedAccountId === account.id ? null : account.id
                        )
                      }
                      variant="secondary"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Inline status update form */}
          {selectedAccountId !== null && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-navy mb-4">
                Update Account Status
              </p>
              <div className="flex gap-4 items-end flex-wrap">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="newStatus"
                    className="text-sm font-medium text-navy"
                  >
                    New Status
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(
                        e.target.value as UpdateAccountStatusRequest['status']
                      )
                    }
                    className="px-4 py-2.5 rounded-input border border-gray-200
                               text-sm font-body bg-surface text-navy
                               focus:outline-none focus:ring-2 focus:ring-gold
                               focus:border-transparent transition-colors
                               duration-150"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="FROZEN">Frozen</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="flex-1">
                  <InputField
                    id="reason"
                    label="Reason"
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for status change"
                    autoComplete="off"
                  />
                </div>

                <Button
                  label="Confirm"
                  onClick={() => handleUpdateStatus(selectedAccountId)}
                  isLoading={isMutating}
                  loadingLabel="Updating..."
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountManagementPage