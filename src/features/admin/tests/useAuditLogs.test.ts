import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAuditLogs } from '../hooks/useAuditLogs'
import * as adminService from '../services/adminService'

vi.mock('../services/adminService', () => ({
  fetchAuditLogs: vi.fn(),
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
      eventType: 'TRANSACTION_CREATED' as const,
      actor: 'user-123',
      description: 'Transfer of ₦5000 completed',
      createdAt: '2026-03-14T12:00:00Z',
    },
    {
      id: 2,
      eventType: 'FRAUD_ALERT' as const,
      actor: 'user-456',
      description: 'Suspicious transaction detected',
      createdAt: '2026-03-14T13:00:00Z',
    },
  ],
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 10,
}

describe('useAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return audit logs on successful fetch', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.logs).toEqual(mockPagedResponse.content)
  })

  it('should return correct pagination metadata', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.totalElements).toBe(2)
    expect(result.current.currentPage).toBe(0)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty logs array when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.logs).toEqual([])
  })

  it('should use default page size of 10 when size is not provided', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockResolvedValueOnce(
      mockPagedResponse
    )

    renderHook(() => useAuditLogs({ page: 0 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() =>
      expect(adminService.fetchAuditLogs).toHaveBeenCalledWith({
        page: 0,
        size: 10,
      })
    )
  })

  it('should use provided page size when specified', async () => {
    vi.mocked(adminService.fetchAuditLogs).mockResolvedValueOnce(
      mockPagedResponse
    )

    renderHook(() => useAuditLogs({ page: 0, size: 20 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() =>
      expect(adminService.fetchAuditLogs).toHaveBeenCalledWith({
        page: 0,
        size: 20,
      })
    )
  })
})