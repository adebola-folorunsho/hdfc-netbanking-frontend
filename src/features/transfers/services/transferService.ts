import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse, PageResponse, Transaction } from '../../dashboard/types/dashboard.types'
import type { TransferRequest } from '../types/transfer.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all transfer-related API calls and nothing else.
 * Components and hooks never call apiClient directly — they go through this service.
 * If an endpoint changes, only this file changes.
 */

// POST /api/v1/transactions/transfer
// Initiates a fund transfer between two accounts
export const initiateTransfer = async (
  data: TransferRequest
): Promise<Transaction> => {
  const response = await apiClient.post<ApiResponse<Transaction>>(
    '/api/v1/transactions/transfer',
    data
  )

  if (!response.data.data) {
    throw new Error('Transfer response missing from server')
  }

  return response.data.data
}

// GET /api/v1/transactions/account/{accountId}
// Returns paginated transactions for a specific account
// Explicit size=20 and sort=createdAt,desc to match backend defaults
export const fetchTransactionsByAccount = async (
  accountId: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Transaction>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Transaction>>>(
    `/api/v1/transactions/account/${accountId}`,
    { params: { page, size, sort: 'createdAt,desc' } }
  )

  if (!response.data.data) {
    return {
      content: [],
      pageable: { pageNumber: 0, pageSize: size },
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
    }
  }

  return response.data.data
}

// GET /api/v1/transactions/{id}
// Returns a single transaction by ID
export const fetchTransactionById = async (
  transactionId: string
): Promise<Transaction> => {
  const response = await apiClient.get<ApiResponse<Transaction>>(
    `/api/v1/transactions/${transactionId}`
  )

  if (!response.data.data) {
    throw new Error('Transaction not found')
  }

  return response.data.data
}