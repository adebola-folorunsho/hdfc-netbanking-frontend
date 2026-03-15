import { useState } from 'react'
import { useTransfer } from '../hooks/useTransfer'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'
import { formatCurrency } from '../../../shared/utils/formatCurrency'
import type { Account } from '../../dashboard/types/dashboard.types'
import type { TransferFormErrors } from '../types/transfer.types'

interface TransferFormProps {
  accounts: Account[]
  onSuccess: () => void
}

// Account number format — HDFC followed by exactly 10 digits
const ACCOUNT_NUMBER_REGEX = /^HDFC\d{10}$/
const MINIMUM_TRANSFER_AMOUNT = 1.00

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the transfer form UI and delegates submission
 * logic to useTransfer. It handles local form state and validation only.
 */
const TransferForm = ({ accounts, onSuccess }: TransferFormProps) => {
  const { transfer, isLoading, isSuccess, errorMessage, reset } = useTransfer()

  const [sourceAccountId, setSourceAccountId] = useState(
    accounts[0]?.id ?? 0
  )
  const [destinationAccountNumber, setDestinationAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<TransferFormErrors>({})

  // Navigate to success state when transfer completes
  if (isSuccess) {
    onSuccess()
    reset()
  }

  const validate = (): boolean => {
    const newErrors: TransferFormErrors = {}

    if (!destinationAccountNumber.trim()) {
      newErrors.destinationAccountId = 'Receiver account number is required'
    } else if (!ACCOUNT_NUMBER_REGEX.test(destinationAccountNumber.trim())) {
      newErrors.destinationAccountId =
        'Account number must start with HDFC followed by 10 digits'
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (parseFloat(amount) < MINIMUM_TRANSFER_AMOUNT) {
      newErrors.amount = `Minimum transfer amount is ${formatCurrency(
        MINIMUM_TRANSFER_AMOUNT
      )}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    // Generate a unique idempotency reference for this transfer request
    const reference = `TXN-${crypto.randomUUID()}`

    await transfer({
      sourceAccountId,
      // Backend resolves account by account number — sent as destinationAccountId
      // The backend accepts account number string and resolves to Long ID
      destinationAccountId: destinationAccountNumber.trim() as unknown as number,
      // Amount sent as string — backend expects String for BigDecimal parsing
      amount: parseFloat(amount).toFixed(2),
      currency: 'NGN',
      reference,
      description: description.trim() || undefined,
    })
  }

  return (
    <div className="bg-surface rounded-xl shadow-card px-8 py-10">
      <h2 className="font-display text-2xl font-semibold text-navy mb-6">
        Send Money
      </h2>

      {/* API error message */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Sender account dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="senderAccountId"
            className="text-sm font-medium text-navy"
          >
            From Account
          </label>
          <select
            id="senderAccountId"
            value={sourceAccountId}
            onChange={(e) => setSourceAccountId(Number(e.target.value))}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-input border border-gray-200
                       text-sm font-body bg-surface text-navy
                       focus:outline-none focus:ring-2 focus:ring-gold
                       focus:border-transparent transition-colors duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} —{' '}
                {formatCurrency(account.balance, account.currency)}
              </option>
            ))}
          </select>
        </div>

        <InputField
          id="receiverAccountNumber"
          label="Receiver Account Number"
          type="text"
          value={destinationAccountNumber}
          onChange={(e) => setDestinationAccountNumber(e.target.value)}
          placeholder="HDFC0987654321"
          error={errors.destinationAccountId}
          disabled={isLoading}
          autoComplete="off"
        />

        <InputField
          id="amount"
          label="Amount (NGN)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000.00"
          error={errors.amount}
          disabled={isLoading}
          autoComplete="off"
        />

        <InputField
          id="description"
          label="Description (optional)"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note"
          error={errors.description}
          disabled={isLoading}
          autoComplete="off"
        />

        <Button
          label="Send Money"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingLabel="Sending..."
          fullWidth
        />
      </div>
    </div>
  )
}

export default TransferForm