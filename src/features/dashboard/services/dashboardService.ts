import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse, PageResponse, Account, AccountBalance, Transaction } from '../types/dashboard.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all dashboard-related API calls and nothing else.
 * Components and hooks never call apiClient directly — they go through this service.
 * If an endpoint changes, only this file changes.
 */

// GET /api/v1/accounts/my-accounts
// Returns all accounts belonging to the authenticated customer
export const fetchMyAccounts = async (): Promise<Account[]> => {
  const response = await apiClient.get<ApiResponse<Account[]>>(
    '/api/v1/accounts/my-accounts'
  )

  if (!response.data.data) {
    return []
  }

  return response.data.data
}

// GET /api/v1/accounts/{id}/balance
// Returns the current balance for a specific account
export const fetchAccountBalance = async (
  accountId: number
): Promise<AccountBalance> => {
  const response = await apiClient.get<ApiResponse<AccountBalance>>(
    `/api/v1/accounts/${accountId}/balance`
  )

  if (!response.data.data) {
    throw new Error('Balance data missing from response')
  }

  return response.data.data
}

// GET /api/v1/transactions/my-transactions
// Returns paginated transactions for the authenticated customer
// page is 0-indexed — Spring Boot pagination convention
// Explicit size=20 and sort=createdAt,desc to match backend defaults
export const fetchMyTransactions = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Transaction>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Transaction>>>(
    '/api/v1/transactions/my-transactions',
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