import { useQuery } from '@tanstack/react-query'
import { fetchStatementsByUser } from '../services/adminService'
import type { Statement, PagedResponse } from '../types/admin.types'

interface UseStatementsByUserProps {
  userId: number
  page: number
  size?: number
}

// Query key factory — userId and page are included so each
// combination is cached independently
export const statementsByUserQueryKey = (
  userId: number,
  page: number,
  size: number
) => ['statements-by-user', userId, page, size] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the statements-by-user fetching logic and nothing else.
 * Disabled when userId is 0 — prevents fetches before the admin
 * has entered a user ID to search for.
 *
 * placeholderData keeps the previous page visible while the next
 * loads, preventing UI flicker during pagination.
 */

/**
 * Fetches a paginated list of statements for a given user ID.
 *
 * @param userId - The user ID to fetch statements for. Pass 0 to disable.
 * @param page - Zero-based page number
 * @param size - Number of items per page (default 10)
 * @returns Paginated statements, loading, and error state
 */
export const useStatementsByUser = ({
  userId,
  page,
  size = 10,
}: UseStatementsByUserProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: statementsByUserQueryKey(userId, page, size),
    queryFn: (): Promise<PagedResponse<Statement>> =>
      fetchStatementsByUser(userId, page, size),
    // Do not fetch when userId is 0 — uninitialised or not yet entered
    enabled: userId > 0,
    placeholderData: (previousData) => previousData,
  })

  return {
    statements: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    currentPage: data?.number ?? 0,
    isLoading: userId > 0 ? isLoading : false,
    isError,
  }
}