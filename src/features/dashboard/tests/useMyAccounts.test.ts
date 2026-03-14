import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useMyAccounts } from '../hooks/useMyAccounts'
import * as dashboardService from '../services/dashboardService'

vi.mock('../services/dashboardService', () => ({
  fetchMyAccounts: vi.fn(),
}))

// TanStack Query requires a QueryClient provider wrapper for all hook tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests — we want errors to surface immediately
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockAccounts = [
  {
    id: '1',
    userId: '10',
    accountNumber: 'HDFC1234567890',
    accountType: 'SAVINGS' as const,
    balance: '50000.0000',
    currency: 'NGN' as const,
    status: 'ACTIVE' as const,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

describe('useMyAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return accounts on successful fetch', async () => {
    vi.mocked(dashboardService.fetchMyAccounts).mockResolvedValueOnce(
      mockAccounts
    )

    const { result } = renderHook(() => useMyAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.accounts).toEqual(mockAccounts)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(dashboardService.fetchMyAccounts).mockResolvedValueOnce(
      mockAccounts
    )

    const { result } = renderHook(() => useMyAccounts(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(dashboardService.fetchMyAccounts).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useMyAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty array when no accounts exist', async () => {
    vi.mocked(dashboardService.fetchMyAccounts).mockResolvedValueOnce([])

    const { result } = renderHook(() => useMyAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.accounts).toEqual([])
  })
})