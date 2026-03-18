import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAuditLogById } from '../hooks/useAuditLogById'
import * as adminService from '../services/adminService'

vi.mock('../services/adminService', () => ({
  fetchAuditLogById: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockAuditLog = {
  id: 1,
  eventType: 'TRANSACTION_CREATED' as const,
  actor: 'user-123',
  description: 'Transfer of ₦5000 completed',
  createdAt: '2026-03-14T12:00:00Z',
}

describe('useAuditLogById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return audit log on successful fetch', async () => {
    vi.mocked(adminService.fetchAuditLogById).mockResolvedValueOnce(
      mockAuditLog
    )

    const { result } = renderHook(() => useAuditLogById(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.log).toEqual(mockAuditLog)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(adminService.fetchAuditLogById).mockResolvedValueOnce(
      mockAuditLog
    )

    const { result } = renderHook(() => useAuditLogById(1), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogById).mockRejectedValueOnce(
      new Error('Not found')
    )

    const { result } = renderHook(() => useAuditLogById(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return null log when fetch fails', async () => {
    vi.mocked(adminService.fetchAuditLogById).mockRejectedValueOnce(
      new Error('Not found')
    )

    const { result } = renderHook(() => useAuditLogById(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.log).toBeNull()
  })

  it('should not fetch when id is 0', async () => {
    const { result } = renderHook(() => useAuditLogById(0), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(adminService.fetchAuditLogById).not.toHaveBeenCalled()
  })
})