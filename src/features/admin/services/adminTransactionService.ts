import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse } from '../../dashboard/types/dashboard.types'
import type {
  AdminTransactionResponse,
  DepositWithdrawalRequest,
} from '../types/admin.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all admin transaction-related API calls and nothing else.
 * These endpoints go through the API Gateway (port 8080) with
 * @PreAuthorize role enforcement — not the Admin Gateway.
 */

/**
 * Reverses a transaction by ID.
 * POST /api/v1/transactions/{id}/reverse
 * Roles: ADMIN only
 */
export const reverseTransaction = async (
  transactionId: number
): Promise<AdminTransactionResponse> => {
  const response = await apiClient.post<ApiResponse<AdminTransactionResponse>>(
    `/api/v1/transactions/${transactionId}/reverse`
  )

  if (!response.data.data) {
    throw new Error(`Failed to reverse transaction ${transactionId}`)
  }

  return response.data.data
}

/**
 * Processes a deposit into an account.
 * POST /api/v1/transactions/deposit
 * Roles: TELLER, ADMIN
 * transactionReference is a client-generated idempotency key — TXN-${crypto.randomUUID()}
 */
export const processDeposit = async (
  data: DepositWithdrawalRequest
): Promise<AdminTransactionResponse> => {
  const response = await apiClient.post<ApiResponse<AdminTransactionResponse>>(
    '/api/v1/transactions/deposit',
    data
  )

  if (!response.data.data) {
    throw new Error('Deposit failed — no response data from server')
  }

  return response.data.data
}

/**
 * Processes a withdrawal from an account.
 * POST /api/v1/transactions/withdrawal
 * Roles: TELLER, ADMIN
 * transactionReference is a client-generated idempotency key — TXN-${crypto.randomUUID()}
 */
export const processWithdrawal = async (
  data: DepositWithdrawalRequest
): Promise<AdminTransactionResponse> => {
  const response = await apiClient.post<ApiResponse<AdminTransactionResponse>>(
    '/api/v1/transactions/withdrawal',
    data
  )

  if (!response.data.data) {
    throw new Error('Withdrawal failed — no response data from server')
  }

  return response.data.data
}