import { useQuery } from '@tanstack/react-query'
import { fetchExchangeRate } from '../services/currencyService'
import type { ExchangeRate } from '../types/currency.types'

interface UseCurrencyRateProps {
  from: string
  to: string
}

// Query key factory — includes from and to so each pair is cached independently
export const currencyRateQueryKey = (from: string, to: string) =>
  ['currency-rate', from, to] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the exchange rate fetching logic and nothing else.
 * TanStack Query handles caching automatically — rates are cached for
 * the staleTime configured in QueryClient (30s) then refetched.
 * Backend Redis cache provides an additional 1 hour TTL.
 *
 * Same-currency shortcut — if from === to, skip the API call entirely
 * and return null. The backend handles this but avoiding the call is cleaner.
 */
export const useCurrencyRate = ({ from, to }: UseCurrencyRateProps) => {
  const isSameCurrency = from === to

  const { data, isLoading, isError, isSuccess } = useQuery<ExchangeRate>({
    queryKey: currencyRateQueryKey(from, to),
    queryFn: () => fetchExchangeRate(from, to),
    // Skip the API call entirely when currencies are the same
    enabled: !isSameCurrency,
  })

  return {
    rate: data ?? null,
    isLoading: isSameCurrency ? false : isLoading,
    isError,
    isSuccess: isSameCurrency ? true : isSuccess,
  }
}