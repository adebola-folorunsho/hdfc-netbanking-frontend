import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserById,
  verifyUserKyc,
  assignUserRole,
  revokeUserRole,
} from '../services/adminUserService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { useState } from 'react'
import type { UserProfile, RoleAssignmentRequest } from '../types/admin.types'

// Query key factory — includes userId so each user is cached independently
export const userLookupQueryKey = (userId: number) =>
  ['admin-user', userId] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns all user lookup operations — fetch, KYC verification,
 * role assignment, and role revocation.
 * On mutation success it invalidates the user cache so the UI
 * reflects the latest state without a page reload.
 */
export const useUserLookup = (userId: number) => {
  const queryClient = useQueryClient()
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)

  const { data, isLoading, isError, isSuccess } = useQuery<UserProfile>({
    queryKey: userLookupQueryKey(userId),
    queryFn: () => fetchUserById(userId),
    // Skip fetch when userId is 0 — no user selected yet
    enabled: userId !== 0,
  })

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({
      queryKey: userLookupQueryKey(userId),
    })
  }

  const verifyKyc = async () => {
    setIsMutating(true)
    setMutationError(null)
    try {
      await verifyUserKyc(userId)
      await invalidateUser()
    } catch (error: unknown) {
      setMutationError(
        extractErrorMessage(error, 'KYC verification failed. Please try again.')
      )
    } finally {
      setIsMutating(false)
    }
  }

  const assignRole = async (role: RoleAssignmentRequest['role']) => {
    setIsMutating(true)
    setMutationError(null)
    try {
      await assignUserRole(userId, { role })
      await invalidateUser()
    } catch (error: unknown) {
      setMutationError(
        extractErrorMessage(error, 'Role assignment failed. Please try again.')
      )
    } finally {
      setIsMutating(false)
    }
  }

  const revokeRole = async (role: RoleAssignmentRequest['role']) => {
    setIsMutating(true)
    setMutationError(null)
    try {
      await revokeUserRole(userId, { role })
      await invalidateUser()
    } catch (error: unknown) {
      setMutationError(
        extractErrorMessage(error, 'Role revocation failed. Please try again.')
      )
    } finally {
      setIsMutating(false)
    }
  }

  return {
    user: data ?? null,
    isLoading: userId !== 0 ? isLoading : false,
    isError,
    isSuccess: userId !== 0 ? isSuccess : false,
    isMutating,
    mutationError,
    verifyKyc,
    assignRole,
    revokeRole,
  }
}