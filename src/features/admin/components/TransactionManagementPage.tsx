import { useState } from 'react'
import { useTransactionManagement } from '../hooks/useTransactionManagement'
import Button from '../../../shared/components/Button'
import InputField from '../../../shared/components/InputField'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the transaction management page UI and delegates
 * all operations to useTransactionManagement.
 * Three sections: reverse a transaction, process a deposit, process a withdrawal.
 * Each section has its own local validation state.
 */
const TransactionManagementPage = () => {
  const {
    reverse,
    deposit,
    withdrawal,
    reset,
    isLoading,
    isSuccess,
    errorMessage,
  } = useTransactionManagement()

  // Reverse section state
  const [transactionId, setTransactionId] = useState('')
  const [reverseError, setReverseError] = useState<string | null>(null)

  // Deposit/withdrawal section state
  const [depositAccountId, setDepositAccountId] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositDescription, setDepositDescription] = useState('')
  const [depositError, setDepositError] = useState<string | null>(null)

  const [withdrawalAccountId, setWithdrawalAccountId] = useState('')
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalDescription, setWithdrawalDescription] = useState('')
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null)

  const handleReverse = async () => {
    const parsed = parseInt(transactionId.trim(), 10)
    if (!transactionId.trim() || isNaN(parsed) || parsed <= 0) {
      setReverseError('Please enter a valid transaction ID')
      return
    }
    setReverseError(null)
    await reverse(parsed)
  }

  const handleDeposit = async () => {
    const parsedAccountId = parseInt(depositAccountId.trim(), 10)
    if (!depositAccountId.trim() || isNaN(parsedAccountId) || parsedAccountId <= 0) {
      setDepositError('Please enter a valid account ID')
      return
    }
    if (!depositAmount.trim() || parseFloat(depositAmount) <= 0) {
      setDepositError('Please enter a valid amount')
      return
    }
    setDepositError(null)
    await deposit({
      accountId: parsedAccountId,
      transactionType: 'DEPOSIT',
      amount: parseFloat(depositAmount).toFixed(2),
      currencyCode: 'NGN',
      description: depositDescription.trim() || undefined,
      transactionReference: `TXN-${crypto.randomUUID()}`,
    })
  }

  const handleWithdrawal = async () => {
    const parsedAccountId = parseInt(withdrawalAccountId.trim(), 10)
    if (!withdrawalAccountId.trim() || isNaN(parsedAccountId) || parsedAccountId <= 0) {
      setWithdrawalError('Please enter a valid account ID')
      return
    }
    if (!withdrawalAmount.trim() || parseFloat(withdrawalAmount) <= 0) {
      setWithdrawalError('Please enter a valid amount')
      return
    }
    setWithdrawalError(null)
    await withdrawal({
      accountId: parsedAccountId,
      transactionType: 'WITHDRAWAL',
      amount: parseFloat(withdrawalAmount).toFixed(2),
      currencyCode: 'NGN',
      description: withdrawalDescription.trim() || undefined,
      transactionReference: `TXN-${crypto.randomUUID()}`,
    })
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-navy mb-6">
        Transaction Management
      </h2>

      {/* Global error message */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          {errorMessage}
        </div>
      )}

      {/* Global success message */}
      {isSuccess && (
        <div className="mb-6 px-4 py-3 rounded-input bg-green-50 border
                        border-success text-success text-sm flex items-center
                        justify-between">
          <span>Operation completed successfully.</span>
          <button
            type="button"
            onClick={reset}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6">

        {/* Reverse transaction section */}
        <div className="bg-surface rounded-xl shadow-card px-6 py-6">
          <h3 className="font-display text-lg font-semibold text-navy mb-4">
            Reverse Transaction
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <InputField
                id="transactionId"
                label="Transaction ID"
                type="number"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                error={reverseError ?? undefined}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <Button
              label="Reverse"
              onClick={handleReverse}
              isLoading={isLoading}
              loadingLabel="Reversing..."
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Deposit section */}
        <div className="bg-surface rounded-xl shadow-card px-6 py-6">
          <h3 className="font-display text-lg font-semibold text-navy mb-4">
            Process Deposit
          </h3>

          {depositError && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              {depositError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="depositAccountId"
                label="Account ID"
                type="number"
                value={depositAccountId}
                onChange={(e) => setDepositAccountId(e.target.value)}
                placeholder="Enter account ID"
                disabled={isLoading}
                autoComplete="off"
              />
              <InputField
                id="depositAmount"
                label="Amount (NGN)"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="1000.00"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <InputField
              id="depositDescription"
              label="Description (optional)"
              type="text"
              value={depositDescription}
              onChange={(e) => setDepositDescription(e.target.value)}
              placeholder="Add a note"
              disabled={isLoading}
              autoComplete="off"
            />
            <div>
              <Button
                label="Process Deposit"
                onClick={handleDeposit}
                isLoading={isLoading}
                loadingLabel="Processing..."
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Withdrawal section */}
        <div className="bg-surface rounded-xl shadow-card px-6 py-6">
          <h3 className="font-display text-lg font-semibold text-navy mb-4">
            Process Withdrawal
          </h3>

          {withdrawalError && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              {withdrawalError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="withdrawalAccountId"
                label="Account ID"
                type="number"
                value={withdrawalAccountId}
                onChange={(e) => setWithdrawalAccountId(e.target.value)}
                placeholder="Enter account ID"
                disabled={isLoading}
                autoComplete="off"
              />
              <InputField
                id="withdrawalAmount"
                label="Amount (NGN)"
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="1000.00"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <InputField
              id="withdrawalDescription"
              label="Description (optional)"
              type="text"
              value={withdrawalDescription}
              onChange={(e) => setWithdrawalDescription(e.target.value)}
              placeholder="Add a note"
              disabled={isLoading}
              autoComplete="off"
            />
            <div>
              <Button
                label="Process Withdrawal"
                onClick={handleWithdrawal}
                isLoading={isLoading}
                loadingLabel="Processing..."
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionManagementPage