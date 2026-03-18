import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogById } from '../services/adminService'
import type { AuditLog } from '../types/admin.types'

// Query key factory — id is included so each log is cached independently
export const auditLogByIdQueryKey = (id: number) =>
  ['audit-log', id] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the single audit log fetching logic and nothing else.
 * Disabled when id is 0 — prevents accidental fetches with an uninitialised id.
 */

/**
 * Fetches a single audit log entry by its ID from the Admin Gateway.
 *
 * @param id - The audit log ID. Pass 0 to disable the query.
 * @returns The audit log entry, loading, and error state
 */
export const useAuditLogById = (id: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: auditLogByIdQueryKey(id),
    queryFn: (): Promise<AuditLog> => fetchAuditLogById(id),
    // Do not fetch when id is 0 — uninitialised or invalid
    enabled: id > 0,
  })

  return {
    log: data ?? null,
    isLoading: id > 0 ? isLoading : false,
    isError,
  }
}