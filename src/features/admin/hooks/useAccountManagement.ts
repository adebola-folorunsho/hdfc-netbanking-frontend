import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  fetchAccountsByUserId,
  updateAccountStatus,
} from '../services/adminAccountService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import type {
  AdminAccountResponse,
  UpdateAccountStatusRequest,
} from '../types/admin.types'

// Query key factory — includes userId so each user's accounts are cached independently
export const accountManagementQueryKey = (userId: number) =>
  ['admin-accounts', userId] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns all account management operations — fetch and status update.
 * On mutation success it invalidates the accounts cache so the UI
 * reflects the latest state without a page reload.
 */
export const useAccountManagement = (userId: number) => {
  const queryClient = useQueryClient()
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)

  type AccountList = AdminAccountResponse[]
  const { data, isLoading, isError, isSuccess } = useQuery<AccountList>({
    queryKey: accountManagementQueryKey(userId),
    queryFn: () => fetchAccountsByUserId(userId),
    enabled: userId !== 0,
  })

  const updateStatus = async (
    accountId: number,
    data: UpdateAccountStatusRequest
  ) => {
    setIsMutating(true)
    setMutationError(null)
    try {
      await updateAccountStatus(accountId, data)
      await queryClient.invalidateQueries({
        queryKey: accountManagementQueryKey(userId),
      })
    } catch (error: unknown) {
      setMutationError(
        extractErrorMessage(
          error,
          'Account status update failed. Please try again.'
        )
      )
    } finally {
      setIsMutating(false)
    }
  }

  return {
    accounts: data ?? [],
    isLoading: userId !== 0 ? isLoading : false,
    isError,
    isSuccess: userId !== 0 ? isSuccess : false,
    isMutating,
    mutationError,
    updateStatus,
  }
}