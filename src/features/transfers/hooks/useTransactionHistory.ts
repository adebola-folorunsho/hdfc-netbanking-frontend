import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionsByAccount } from '../services/transferService'
import type { Transaction } from '../../dashboard/types/dashboard.types'

interface UseTransactionHistoryProps {
  accountId: string
  typeFilter?: Transaction['type']
}

// Named type alias — avoids multiline generic that confuses the parser
type TransactionTypeFilter = Transaction['type'] | undefined

export const transactionHistoryQueryKey = (
  accountId: string,
  page: number,
  typeFilter?: Transaction['type']
) => ['transaction-history', accountId, page, typeFilter] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns transaction history fetching, pagination, and type filtering.
 * Filtering is applied client-side on the fetched page — the backend endpoint
 * does not support type filtering directly.
 * If the backend adds filter params later, only this hook changes.
 */
export const useTransactionHistory = ({
  accountId,
  typeFilter: initialTypeFilter,
}: UseTransactionHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [typeFilter, setTypeFilterState] = useState<TransactionTypeFilter>(
    initialTypeFilter
  )

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: transactionHistoryQueryKey(accountId, currentPage, typeFilter),
    queryFn: () => fetchTransactionsByAccount(accountId, currentPage),
    enabled: !!accountId,
  })

  // Client-side type filter — applied after fetch
  const filteredTransactions = typeFilter
    ? (data?.content ?? []).filter((t) => t.type === typeFilter)
    : (data?.content ?? [])

  const setTypeFilter = (filter: TransactionTypeFilter) => {
    // Reset to page 0 whenever filter changes — avoids empty pages
    setCurrentPage(0)
    setTypeFilterState(filter)
  }

  const goToNextPage = () => {
    if (data && !data.last) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return {
    transactions: filteredTransactions,
    isLoading,
    isError,
    isSuccess,
    currentPage,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isFirstPage: data?.first ?? true,
    isLastPage: data?.last ?? true,
    typeFilter,
    setTypeFilter,
    goToNextPage,
    goToPreviousPage,
  }
}