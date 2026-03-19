import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse } from '../../dashboard/types/dashboard.types'
import type {
  AdminAccountResponse,
  UpdateAccountStatusRequest,
} from '../types/admin.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all admin account-related API calls and nothing else.
 * These endpoints go through the API Gateway (port 8080) with
 * @PreAuthorize role enforcement — not the Admin Gateway.
 */

/**
 * Fetches all accounts belonging to a specific user.
 * GET /api/v1/accounts/user/{userId}
 * Roles: TELLER, ADMIN
 */
export const fetchAccountsByUserId = async (
  userId: number
): Promise<AdminAccountResponse[]> => {
  const response = await apiClient.get<ApiResponse<AdminAccountResponse[]>>(
    `/api/v1/accounts/user/${userId}`
  )

  if (!response.data.data) {
    return []
  }

  return response.data.data
}

/**
 * Updates the status of a specific account.
 * PATCH /api/v1/accounts/{accountId}/status
 * Roles: TELLER, ADMIN
 */
export const updateAccountStatus = async (
  accountId: number,
  data: UpdateAccountStatusRequest
): Promise<AdminAccountResponse> => {
  const response = await apiClient.patch<ApiResponse<AdminAccountResponse>>(
    `/api/v1/accounts/${accountId}/status`,
    data
  )

  if (!response.data.data) {
    throw new Error(`Failed to update status for account ${accountId}`)
  }

  return response.data.data
}