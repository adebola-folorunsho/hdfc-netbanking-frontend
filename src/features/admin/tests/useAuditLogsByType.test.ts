import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAuditLogsByType } from '../hooks/useAuditLogsByType'
import * as adminService from '../services/adminService'

vi.mock('../services/adminService', () => ({
  fetchAuditLogsByType: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockPagedResponse = {
  content: [
    {
      id: 1,
      eventType: 'FRAUD_ALERT' as const,
      actor: 'user-456',
      description: 'Suspicious transaction detected',
      createdAt: '2026-03-14T13:00:00Z',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
}

describe('useAuditLogsByType', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return filtered audit logs on successful fetch', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useAuditLogsByType({ eventType: 'FRAUD_ALERT', page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.logs).toEqual(mockPagedResponse.content)
  })

  it('should return correct pagination metadata', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useAuditLogsByType({ eventType: 'FRAUD_ALERT', page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.totalElements).toBe(1)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useAuditLogsByType({ eventType: 'TRANSACTION_CREATED', page: 0 }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(
      () => useAuditLogsByType({ eventType: 'FRAUD_ALERT', page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty logs array when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(
      () => useAuditLogsByType({ eventType: 'FRAUD_ALERT', page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.logs).toEqual([])
  })

  it('should call fetchAuditLogsByType with correct arguments', async () => {
    vi.mocked(adminService.fetchAuditLogsByType).mockResolvedValueOnce(
      mockPagedResponse
    )

    renderHook(
      () => useAuditLogsByType({ eventType: 'FRAUD_ALERT', page: 0, size: 5 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() =>
      expect(adminService.fetchAuditLogsByType).toHaveBeenCalledWith(
        'FRAUD_ALERT',
        { page: 0, size: 5 }
      )
    )
  })
})