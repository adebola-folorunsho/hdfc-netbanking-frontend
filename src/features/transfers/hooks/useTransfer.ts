import { useState } from 'react'
import { initiateTransfer } from '../services/transferService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { useQueryClient } from '@tanstack/react-query'
import { MY_ACCOUNTS_QUERY_KEY } from '../../dashboard/hooks/useMyAccounts'
import type { TransferRequest } from '../types/transfer.types'
import type { Transaction } from '../../dashboard/types/dashboard.types'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the transfer submission flow and nothing else.
 * On success it invalidates the accounts cache so balances refresh
 * automatically — the user sees updated balances without a page reload.
 */
export const useTransfer = () => {
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [transferredTransaction, setTransferredTransaction] =
    useState<Transaction | null>(null)

  const transfer = async (data: TransferRequest) => {
    setIsLoading(true)
    setErrorMessage(null)
    setIsSuccess(false)

    try {
      const transaction = await initiateTransfer(data)
      setTransferredTransaction(transaction)
      setIsSuccess(true)

      // Invalidate accounts cache so balances refresh after transfer
      await queryClient.invalidateQueries({ queryKey: MY_ACCOUNTS_QUERY_KEY })
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, 'Transfer failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsSuccess(false)
    setErrorMessage(null)
    setTransferredTransaction(null)
  }

  return {
    transfer,
    reset,
    isLoading,
    isSuccess,
    errorMessage,
    transferredTransaction,
  }
}