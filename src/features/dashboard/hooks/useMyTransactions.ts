import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMyTransactions } from '../services/dashboardService'
import type { Transaction } from '../types/dashboard.types'

// Query key factory — includes page so each page is cached independently
export const myTransactionsQueryKey = (page: number) =>
  ['my-transactions', page] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the transactions fetching and pagination logic.
 * It exposes a clean interface — components never touch page state directly.
 * Default page size is 20 — matches backend default explicitly.
 */
export const useMyTransactions = (initialPage: number = 0) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: myTransactionsQueryKey(currentPage),
    queryFn: () => fetchMyTransactions(currentPage, 20),
  })

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
    transactions: data?.content ?? [],
    isLoading,
    isError,
    isSuccess,
    currentPage,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isFirstPage: data?.first ?? true,
    isLastPage: data?.last ?? true,
    goToNextPage,
    goToPreviousPage,
  }
}