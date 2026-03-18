import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogsByType } from '../services/adminService'
import type { AuditEventType, AuditLog, PagedResponse } from '../types/admin.types'

interface UseAuditLogsByTypeProps {
  eventType: AuditEventType
  page: number
  size?: number
}

// Query key factory — eventType and page are included so each
// combination is cached independently
export const auditLogsByTypeQueryKey = (
  eventType: AuditEventType,
  page: number,
  size: number
) => ['audit-logs-by-type', eventType, page, size] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the event-type-filtered audit logs fetching logic only.
 * Kept separate from useAuditLogs so the two concerns — paginated all logs
 * and filtered logs — do not bleed into each other (SRP, ISP).
 *
 * placeholderData keeps the previous page visible while the next loads,
 * preventing UI flicker during pagination.
 */

/**
 * Fetches a paginated list of audit logs filtered by event type.
 *
 * @param eventType - The event type to filter by
 * @param page - Zero-based page number
 * @param size - Number of items per page (default 10)
 * @returns Filtered paginated audit logs, loading, and error state
 */
export const useAuditLogsByType = ({
  eventType,
  page,
  size = 10,
}: UseAuditLogsByTypeProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: auditLogsByTypeQueryKey(eventType, page, size),
    queryFn: (): Promise<PagedResponse<AuditLog>> =>
      fetchAuditLogsByType(eventType, { page, size }),
    placeholderData: (previousData) => previousData,
  })

  return {
    logs: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    currentPage: data?.number ?? 0,
    isLoading,
    isError,
  }
}