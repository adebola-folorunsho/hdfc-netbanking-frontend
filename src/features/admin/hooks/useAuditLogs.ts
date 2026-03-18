import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogs } from '../services/adminService'
import type { AuditLog, PagedResponse } from '../types/admin.types'

interface UseAuditLogsProps {
  page: number
  size?: number
}

// Query key factory — page is included so each page is cached independently
export const auditLogsQueryKey = (page: number, size: number) =>
  ['audit-logs', page, size] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the paginated audit logs fetching logic and nothing else.
 * The component never knows how data is fetched — it only consumes
 * the clean typed values this hook exposes.
 *
 * keepPreviousData is true so the UI does not flash empty while
 * navigating between pages — the previous page stays visible
 * until the next page resolves.
 */

/**
 * Fetches a paginated list of all audit logs from the Admin Gateway.
 *
 * @param page - Zero-based page number
 * @param size - Number of items per page (default 10)
 * @returns Paginated audit logs, loading, and error state
 */
export const useAuditLogs = ({ page, size = 10 }: UseAuditLogsProps) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: auditLogsQueryKey(page, size),
    queryFn: (): Promise<PagedResponse<AuditLog>> => fetchAuditLogs({ page, size }),
    placeholderData: (previousData) => previousData,
  })

  return {
    logs: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    currentPage: data?.number ?? 0,
    isLoading,
    isError,
    isFetching,
  }
}