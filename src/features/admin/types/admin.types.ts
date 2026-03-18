/**
 * Represents a single audit log entry returned by the Audit Service.
 * Matches the AuditLogResponse DTO from the backend.
 * eventType is string — the backend stores it as a plain String, not an enum.
 */
export interface AuditLog {
  id: number
  eventType: string
  actor: string
  description: string
  createdAt: string
}

/**
 * The known event type values the Audit Service records.
 * Used as a frontend-only filter type — never assumed to be
 * the exhaustive set of values the backend may return.
 */
export type AuditEventType = 'TRANSACTION_CREATED' | 'FRAUD_ALERT'

/**
 * Filter value for the audit logs event type selector.
 * ALL is a frontend-only value — it means no filter is applied.
 */
export type AuditEventTypeFilter = AuditEventType | 'ALL'

/**
 * Represents a single statement entry returned by the Scheduler Service.
 * Matches the StatementResponse DTO from the backend.
 * userId and accountId are number — Java Long serializes as JSON number.
 */
export interface Statement {
  id: number
  userId: number
  accountId: number
  periodStart: string
  periodEnd: string
  generatedAt: string
}

/**
 * Spring Page<T> JSON shape — matches the paginated response
 * returned by all paginated admin endpoints.
 * Only the fields the frontend actually uses are mapped here.
 */
export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

/**
 * Query parameters for paginated audit log requests.
 */
export interface AuditLogQueryParams {
  page: number
  size: number
}