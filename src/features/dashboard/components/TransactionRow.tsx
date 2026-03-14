import { formatCurrency, formatDateTime } from '../../../shared/utils/formatCurrency'
import type { Transaction } from '../types/dashboard.types'
import TransactionStatusBadge from './TransactionStatusBadge'

interface TransactionRowProps {
  transaction: Transaction
}

// Transaction type label map — open for extension, closed for modification (OCP)
const transactionTypeLabels: Record<Transaction['type'], string> = {
  INTERNAL_TRANSFER: 'Internal Transfer',
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  PAYSTACK_PAYMENT: 'Paystack Payment',
}

/*
 * Pattern: Presentational Component (SRP — Single Responsibility Principle)
 * This component owns one responsibility — rendering a single transaction row.
 * No state, no logic, no API calls. Pure display component.
 */
const TransactionRow = ({ transaction }: TransactionRowProps) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-100">
      {/* Transaction type and reference */}
      <td className="py-4 px-4">
        <p className="text-sm font-medium text-navy">
          {transactionTypeLabels[transaction.type]}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {transaction.reference}
        </p>
      </td>

      {/* Date */}
      <td className="py-4 px-4">
        <p className="text-sm text-text-secondary">
          {formatDateTime(transaction.createdAt)}
        </p>
      </td>

      {/* Amount */}
      <td className="py-4 px-4 text-right">
        <p className="text-sm font-semibold text-navy">
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </td>

      {/* Status badge */}
      <td className="py-4 px-4 text-right">
        <TransactionStatusBadge status={transaction.status} />
      </td>
    </tr>
  )
}

export default TransactionRow