import { useState } from 'react'
import { useAuditLogs } from '../hooks/useAuditLogs'
import { useAuditLogsByType } from '../hooks/useAuditLogsByType'
import type { AuditEventTypeFilter } from '../types/admin.types'

/*
 * Pattern: Strategy (GoF)
 * The data-fetching strategy is selected at runtime based on the
 * active filter. When filter is ALL, useAuditLogs is used. When a
 * specific event type is selected, useAuditLogsByType is used.
 * Both hooks expose the same interface so the rendering logic
 * below never needs to know which strategy is active.
 *
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the audit logs page UI and delegates all
 * data fetching to the appropriate hook based on the active filter.
 */

// Maps event type filter values to human-readable badge styles
const EVENT_TYPE_BADGE_CLASS: Record<string, string> = {
  TRANSACTION_CREATED:
    'bg-blue-50 text-blue-700 border border-blue-200',
  FRAUD_ALERT:
    'bg-red-50 text-red-700 border border-red-200',
}

const PAGE_SIZE = 10

/**
 * Admin page displaying a paginated, filterable table of audit logs.
 * Supports filtering by event type — ALL, TRANSACTION_CREATED, FRAUD_ALERT.
 */
const AuditLogsPage = () => {
  const [filter, setFilter] = useState<AuditEventTypeFilter>('ALL')
  const [page, setPage] = useState(0)

  // ALL filter — fetch all logs with pagination
  const allLogs = useAuditLogs({
    page,
    size: PAGE_SIZE,
  })

  // Specific event type filter — fetch filtered logs with pagination
  // Disabled when filter is ALL — hook is always called (Rules of Hooks)
  // but only the active result is used below
  const filteredLogs = useAuditLogsByType({
    eventType: filter === 'ALL' ? 'TRANSACTION_CREATED' : filter,
    page,
    size: PAGE_SIZE,
  })

  // Strategy selection — pick the active data source based on filter
  const activeData = filter === 'ALL' ? allLogs : filteredLogs
  const { logs, totalPages, totalElements, isLoading, isError } = activeData

  const handleFilterChange = (newFilter: AuditEventTypeFilter) => {
    setFilter(newFilter)
    // Reset to first page when filter changes
    setPage(0)
  }

  const badgeClass = (eventType: string) =>
    EVENT_TYPE_BADGE_CLASS[eventType] ??
    'bg-gray-50 text-gray-700 border border-gray-200'

  return (
    <div className="animate-enter">

      {/* Page heading and filter row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy mb-1">
            Audit Logs
          </h2>
          <p className="text-sm text-text-secondary">
            {totalElements} {totalElements === 1 ? 'entry' : 'entries'} total
          </p>
        </div>

        {/* Event type filter — Strategy pattern selector */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="eventTypeFilter"
            className="text-xs font-medium text-text-secondary sr-only"
          >
            Filter by event type
          </label>
          <select
            id="eventTypeFilter"
            value={filter}
            onChange={(e) =>
              handleFilterChange(e.target.value as AuditEventTypeFilter)
            }
            className="px-4 py-2.5 rounded-input border border-gray-200
                       text-sm font-body bg-surface text-navy
                       focus:outline-none focus:ring-2 focus:ring-gold
                       focus:border-transparent transition-colors duration-150"
          >
            <option value="ALL">All Event Types</option>
            <option value="TRANSACTION_CREATED">Transaction Created</option>
            <option value="FRAUD_ALERT">Fraud Alert</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-sm text-text-muted">Loading audit logs...</p>
      )}

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="px-4 py-3 rounded-input bg-red-50 border
                     border-error text-error text-sm"
        >
          Could not load audit logs. Please try again later.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && logs.length === 0 && (
        <p className="text-sm text-text-muted">No audit logs found.</p>
      )}

      {/* Audit logs table */}
      {!isLoading && !isError && logs.length > 0 && (
        <div className="bg-surface rounded-xl shadow-card overflow-hidden
                        border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Event Type
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Actor
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium
                               text-text-muted uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-50 hover:bg-gray-50
                             transition-colors duration-100"
                >
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {log.id}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs
                                  font-medium ${badgeClass(log.eventType)}`}
                    >
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary
                                 font-mono">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 text-sm text-navy max-w-xs
                                 truncate">
                    {log.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary
                                 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-NG', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-text-secondary">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-4 py-2 rounded-input border border-gray-200
                         text-sm font-medium text-navy
                         hover:border-navy transition-colors duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 rounded-input border border-gray-200
                         text-sm font-medium text-navy
                         hover:border-navy transition-colors duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditLogsPage