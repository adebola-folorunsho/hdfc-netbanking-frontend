import type { Transaction } from '../types/dashboard.types'

interface TransactionStatusBadgeProps {
  status: Transaction['status']
}

interface BadgeConfig {
  label: string
  className: string
}

// Badge config map — open for extension, closed for modification (OCP)
const badgeConfig: Record<Transaction['status'], BadgeConfig> = {
  SUCCESS: {
    label: 'Success',
    className: 'bg-green-50 text-success',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-50 text-yellow-700',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-50 text-error',
  },
}

/*
 * Pattern: Presentational Component (SRP — Single Responsibility Principle)
 * This component owns one responsibility — rendering a transaction status badge.
 * No state, no logic, no API calls. Pure display component.
 */
const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
  const config = badgeConfig[status]

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  )
}

export default TransactionStatusBadge