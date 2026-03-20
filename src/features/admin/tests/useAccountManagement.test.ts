import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAccountManagement } from '../hooks/useAccountManagement'
import * as adminAccountService from '../services/adminAccountService'

vi.mock('../services/adminAccountService', () => ({
  fetchAccountsByUserId: vi.fn(),
  updateAccountStatus: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockAccounts = [
  {
    id: 1,
    userId: 10,
    accountNumber: 'HDFC1234567890',
    accountType: 'SAVINGS' as const,
    accountStatus: 'ACTIVE' as const,
    balance: '50000.00',
    currencyCode: 'NGN',
    minimumBalance: '1000.00',
    interestRate: '0.05',
    maturityDate: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

describe('useAccountManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch when userId is 0', () => {
    const { result } = renderHook(() => useAccountManagement(0), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
    expect(adminAccountService.fetchAccountsByUserId).not.toHaveBeenCalled()
  })

  it('should fetch accounts when userId is provided', async () => {
    vi.mocked(adminAccountService.fetchAccountsByUserId).mockResolvedValueOnce(
      mockAccounts
    )

    const { result } = renderHook(() => useAccountManagement(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.accounts).toEqual(mockAccounts)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminAccountService.fetchAccountsByUserId).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useAccountManagement(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty array when no accounts exist', async () => {
    vi.mocked(adminAccountService.fetchAccountsByUserId).mockResolvedValueOnce(
      []
    )

    const { result } = renderHook(() => useAccountManagement(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.accounts).toEqual([])
  })

  it('should call updateAccountStatus with correct data', async () => {
    vi.mocked(adminAccountService.fetchAccountsByUserId).mockResolvedValueOnce(
      mockAccounts
    )
    vi.mocked(adminAccountService.updateAccountStatus).mockResolvedValueOnce(
      { ...mockAccounts[0], accountStatus: 'FROZEN' }
    )

    const { result } = renderHook(() => useAccountManagement(10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await act(async () => {
      await result.current.updateStatus(1, {
        status: 'FROZEN',
        reason: 'Suspicious activity',
      })
    })

    expect(adminAccountService.updateAccountStatus).toHaveBeenCalledWith(1, {
      status: 'FROZEN',
      reason: 'Suspicious activity',
    })
  })
})