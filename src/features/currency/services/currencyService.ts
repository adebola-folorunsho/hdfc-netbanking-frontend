import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse } from '../../dashboard/types/dashboard.types'
import type { ExchangeRate, SupportedCurrencies } from '../types/currency.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all currency-related API calls and nothing else.
 * Components and hooks never call apiClient directly — they go through this service.
 * If an endpoint changes, only this file changes.
 */

// GET /api/v1/currency/rates/{from}/{to}
// Returns the current exchange rate between two currencies
// Cached on backend for 1 hour via Redis Read-Through
export const fetchExchangeRate = async (
  from: string,
  to: string
): Promise<ExchangeRate> => {
  const response = await apiClient.get<ApiResponse<ExchangeRate>>(
    `/api/v1/currency/rates/${from}/${to}`
  )

  if (!response.data.data) {
    throw new Error(`Exchange rate not available for ${from} to ${to}`)
  }

  return response.data.data
}

// GET /api/v1/currency/supported
// Returns the list of supported currency codes
// Used to populate currency dropdowns
export const fetchSupportedCurrencies = async (): Promise<SupportedCurrencies> => {
  const response = await apiClient.get<ApiResponse<SupportedCurrencies>>(
    '/api/v1/currency/supported'
  )

  if (!response.data.data) {
    return []
  }

  return response.data.data
}