import { useQuery } from '@tanstack/react-query'
import { fetchMyAccounts } from '../services/dashboardService'
import type { Account } from '../types/dashboard.types'

// Query key — centralised so cache invalidation is consistent across the app
export const MY_ACCOUNTS_QUERY_KEY = ['my-accounts'] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the accounts fetching logic and nothing else.
 * TanStack Query handles caching, loading, and error states automatically.
 * Components that use this hook only deal with UI — never with fetch logic.
 */
export const useMyAccounts = () => {
  const { data, isLoading, isError, isSuccess } = useQuery<Account[]>({
    queryKey: MY_ACCOUNTS_QUERY_KEY,
    queryFn: fetchMyAccounts,
  })

  return {
    accounts: data ?? [],
    isLoading,
    isError,
    isSuccess,
  }
}