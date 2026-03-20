import { useState } from 'react'
import { useUserLookup } from '../hooks/useUserLookup'
import { formatDateTime } from '../../../shared/utils/formatCurrency'
import type { RoleAssignmentRequest } from '../types/admin.types'
import Button from '../../../shared/components/Button'
import InputField from '../../../shared/components/InputField'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the user lookup page UI and delegates all
 * data fetching and mutations to useUserLookup.
 * Local state owns only the search input and validation error.
 */
const UserLookupPage = () => {
  const [searchInput, setSearchInput] = useState('')
  const [userId, setUserId] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)

  const {
    user,
    isLoading,
    isError,
    isSuccess,
    isMutating,
    mutationError,
    verifyKyc,
    assignRole,
    revokeRole,
  } = useUserLookup(userId)

  const handleSearch = () => {
    const parsed = parseInt(searchInput.trim(), 10)
    if (!searchInput.trim() || isNaN(parsed) || parsed <= 0) {
      setValidationError('Please enter a valid user ID')
      return
    }
    setValidationError(null)
    setUserId(parsed)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-navy mb-6">
        User Lookup
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
        <p className="text-sm text-text-muted">Searching for user...</p>
      )}

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          User not found. Please check the ID and try again.
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

      {/* User profile */}
      {isSuccess && user && (
        <div className="bg-surface rounded-xl shadow-card px-6 py-6">

          {/* Profile header */}
          <div className="flex items-start justify-between mb-6 pb-6
                          border-b border-gray-100">
            <div>
              <h3 className="font-display text-xl font-semibold text-navy">
                {user.fullName}
              </h3>
              <p className="text-sm text-text-secondary mt-1">{user.email}</p>
              <p className="text-sm text-text-secondary">{user.phoneNumber}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full
                  ${user.isEnabled
                    ? 'bg-green-50 text-success'
                    : 'bg-red-50 text-error'
                  }`}
              >
                {user.isEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Profile details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* KYC status */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider
                            mb-1">
                KYC Status
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium
                    ${user.isKycVerified ? 'text-success' : 'text-error'}`}
                >
                  {user.isKycVerified ? 'Verified' : 'Not Verified'}
                </span>
                {!user.isKycVerified && (
                  <Button
                    label="Verify KYC"
                    onClick={verifyKyc}
                    isLoading={isMutating}
                    loadingLabel="Verifying..."
                    variant="secondary"
                  />
                )}
              </div>
            </div>

            {/* 2FA status */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider
                            mb-1">
                Two-Factor Auth
              </p>
              <span
                className={`text-sm font-medium
                  ${user.isTwoFactorEnabled ? 'text-success' : 'text-text-muted'}`}
              >
                {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Roles */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider
                            mb-2">
                Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="text-xs font-medium px-2.5 py-1 rounded-full
                               bg-navy text-surface"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Member since */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider
                            mb-1">
                Member Since
              </p>
              <p className="text-sm text-navy">
                {formatDateTime(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Role management */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-4">
              Role Management
            </p>
            <div className="flex flex-wrap gap-3">
              {(['CUSTOMER', 'TELLER', 'ADMIN'] as RoleAssignmentRequest['role'][]).map(
                (role) => (
                  <div key={role} className="flex gap-2">
                    <Button
                      label={`Assign ${role}`}
                      onClick={() => assignRole(role)}
                      isLoading={isMutating}
                      loadingLabel="Updating..."
                      variant="secondary"
                    />
                    <Button
                      label={`Revoke ${role}`}
                      onClick={() => revokeRole(role)}
                      isLoading={isMutating}
                      loadingLabel="Updating..."
                      variant="secondary"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserLookupPage