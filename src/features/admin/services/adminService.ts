import adminApiClient from '../../../shared/utils/adminApiClient'
import type {
  AuditLog,
  AuditEventType,
  AuditLogQueryParams,
  PagedResponse,
  Statement,
} from '../types/admin.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all admin API calls and nothing else.
 * Hooks and components never call adminApiClient directly — they go
 * through this service. If an endpoint changes, only this file changes.
 *
 * All endpoints route through the Admin Gateway (port 8090) which
 * enforces ROLE_ADMIN on every request before forwarding downstream.
 */

/**
 * Fetches a paginated list of all audit logs.
 * GET /api/v1/audit/logs?page={page}&size={size}
 *
 * @param params - Pagination parameters (page, size)
 * @returns A paginated response containing audit log entries
 * @throws Error if the request fails or the response shape is unexpected
 */
export const fetchAuditLogs = async (
  params: AuditLogQueryParams
): Promise<PagedResponse<AuditLog>> => {
  const response = await adminApiClient.get<PagedResponse<AuditLog>>(
    '/api/v1/audit/logs',
    { params }
  )
  return response.data
}

/**
 * Fetches a single audit log entry by its ID.
 * GET /api/v1/audit/logs/{id}
 *
 * @param id - The audit log ID
 * @returns The matching audit log entry
 * @throws Error if the log is not found or the request fails
 */
export const fetchAuditLogById = async (id: number): Promise<AuditLog> => {
  const response = await adminApiClient.get<AuditLog>(
    `/api/v1/audit/logs/${id}`
  )
  return response.data
}

/**
 * Fetches a paginated list of audit logs filtered by event type.
 * GET /api/v1/audit/logs/type/{eventType}?page={page}&size={size}
 *
 * @param eventType - The event type to filter by (TRANSACTION_CREATED | FRAUD_ALERT)
 * @param params - Pagination parameters (page, size)
 * @returns A paginated response containing filtered audit log entries
 * @throws Error if the request fails
 */
export const fetchAuditLogsByType = async (
  eventType: AuditEventType,
  params: AuditLogQueryParams
): Promise<PagedResponse<AuditLog>> => {
  const response = await adminApiClient.get<PagedResponse<AuditLog>>(
    `/api/v1/audit/logs/type/${eventType}`,
    { params }
  )
  return response.data
}

/**
 * Fetches a paginated list of statements for a given user.
 * GET /api/v1/scheduler/statements/user/{userId}
 *
 * @param userId - The user ID to fetch statements for
 * @param page - Zero-based page number
 * @param size - Number of items per page
 * @returns A paginated response containing statement entries
 * @throws Error if the request fails
 */
export const fetchStatementsByUser = async (
  userId: number,
  page: number,
  size: number
): Promise<PagedResponse<Statement>> => {
  const response = await adminApiClient.get<PagedResponse<Statement>>(
    `/api/v1/scheduler/statements/user/${userId}`,
    { params: { page, size } }
  )
  return response.data
}

/**
 * Fetches a single statement by its ID.
 * GET /api/v1/scheduler/statements/{id}
 *
 * @param id - The statement ID
 * @returns The matching statement entry
 * @throws Error if the statement is not found or the request fails
 */
export const fetchStatementById = async (id: number): Promise<Statement> => {
  const response = await adminApiClient.get<Statement>(
    `/api/v1/scheduler/statements/${id}`
  )
  return response.data
}