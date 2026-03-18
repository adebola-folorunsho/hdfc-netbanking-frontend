import { useQuery } from '@tanstack/react-query'
import { fetchSupportedCurrencies } from '../services/currencyService'

export const SUPPORTED_CURRENCIES_QUERY_KEY = ['supported-currencies'] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the supported currencies fetching logic and nothing else.
 * The supported currencies list changes rarely — TanStack Query caches it
 * for the configured staleTime so the API is not hammered on every render.
 */
export const useSupportedCurrencies = () => {
  const { data, isLoading, isError, isSuccess } = useQuery<string[]>({
    queryKey: SUPPORTED_CURRENCIES_QUERY_KEY,
    queryFn: fetchSupportedCurrencies,
    // Supported currencies rarely change — cache for 10 minutes
    staleTime: 10 * 60 * 1000,
  })

  return {
    currencies: data ?? [],
    isLoading,
    isError,
    isSuccess,
  }
}