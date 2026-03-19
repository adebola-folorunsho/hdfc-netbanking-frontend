import { useState } from 'react'
import {
  reverseTransaction,
  processDeposit,
  processWithdrawal,
} from '../services/adminTransactionService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import type {
  AdminTransactionResponse,
  DepositWithdrawalRequest,
} from '../types/admin.types'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns all transaction management operations — reverse,
 * deposit, and withdrawal. It holds no server state — these are
 * fire-and-confirm mutations, not cached queries.
 */
export const useTransactionManagement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastTransaction, setLastTransaction] =
    useState<AdminTransactionResponse | null>(null)

  const execute = async (
    operation: () => Promise<AdminTransactionResponse>
  ) => {
    setIsLoading(true)
    setIsSuccess(false)
    setErrorMessage(null)

    try {
      const transaction = await operation()
      setLastTransaction(transaction)
      setIsSuccess(true)
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, 'Operation failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const reverse = async (transactionId: number) => {
    await execute(() => reverseTransaction(transactionId))
  }

  const deposit = async (data: DepositWithdrawalRequest) => {
    await execute(() => processDeposit(data))
  }

  const withdrawal = async (data: DepositWithdrawalRequest) => {
    await execute(() => processWithdrawal(data))
  }

  const reset = () => {
    setIsSuccess(false)
    setErrorMessage(null)
    setLastTransaction(null)
  }

  return {
    reverse,
    deposit,
    withdrawal,
    reset,
    isLoading,
    isSuccess,
    errorMessage,
    lastTransaction,
  }
}