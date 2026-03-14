import { formatCurrency } from '../../../shared/utils/formatCurrency'
import type { Account } from '../types/dashboard.types'

interface AccountCardProps {
  account: Account
}

// Display label map — open for extension, closed for modification (OCP)
const accountTypeLabels: Record<Account['accountType'], string> = {
  SAVINGS: 'Savings Account',
  CURRENT: 'Current Account',
  FIXED_DEPOSIT: 'Fixed Deposit',
}

// Status display map — maps backend enum to human-readable label and style
interface StatusConfig {
  label: string
  className: string
}

// Status display map — maps backend enum to human-readable label and style
const statusConfig: Record<Account['status'], StatusConfig> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-50 text-success',
  },
  INACTIVE: {
    label: 'Inactive',
    className: 'bg-gray-100 text-text-muted',
  },
  FROZEN: {
    label: 'Frozen',
    className: 'bg-blue-50 text-blue-700',
  },
}

/*
 * Pattern: Presentational Component (SRP — Single Responsibility Principle)
 * This component owns one responsibility — rendering a single account card.
 * It holds no state, makes no API calls, and knows nothing about the list
 * it belongs to. All data flows in via props.
 */
const AccountCard = ({ account }: AccountCardProps) => {
  const status = statusConfig[account.status]
  const accountTypeLabel = accountTypeLabels[account.accountType]

  return (
    <div className="bg-surface rounded-xl shadow-card p-6 border border-gray-100
                    hover:shadow-elevated transition-shadow duration-200">

      {/* Account type and status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-text-secondary uppercase
                         tracking-wider">
          {accountTypeLabel}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                          ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* Balance — most prominent element on the card */}
      <div className="mb-4">
        <p className="text-xs text-text-muted mb-1">Available Balance</p>
        <p className="font-display text-2xl font-semibold text-navy">
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>

      {/* Account number */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-text-muted mb-0.5">Account Number</p>
        <p className="text-sm font-medium text-navy tracking-wider">
          {account.accountNumber}
        </p>
      </div>
    </div>
  )
}

export default AccountCard