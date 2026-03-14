import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import * as transferService from '../services/transferService'

vi.mock('../services/transferService', () => ({
  fetchTransactionsByAccount: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockPageResponse = {
  content: [
    {
      id: '1',
      senderAccountId: '10',
      receiverAccountId: '20',
      amount: '5000.0000',
      currency: 'NGN' as const,
      status: 'SUCCESS' as const,
      type: 'INTERNAL_TRANSFER' as const,
      reference: 'TXN-abc123',
      createdAt: '2026-03-14T13:00:00Z',
    },
  ],
  pageable: { pageNumber: 0, pageSize: 10 },
  totalElements: 1,
  totalPages: 1,
  last: true,
  first: true,
}

describe('useTransactionHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return transactions for a given accountId', async () => {
    vi.mocked(transferService.fetchTransactionsByAccount).mockResolvedValueOnce(
      mockPageResponse
    )

    const { result } = renderHook(
      () => useTransactionHistory({ accountId: 'account-uuid' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.transactions).toEqual(mockPageResponse.content)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(transferService.fetchTransactionsByAccount).mockResolvedValueOnce(
      mockPageResponse
    )

    const { result } = renderHook(
      () => useTransactionHistory({ accountId: 'account-uuid' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(
      transferService.fetchTransactionsByAccount
    ).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(
      () => useTransactionHistory({ accountId: 'account-uuid' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return pagination metadata', async () => {
    vi.mocked(transferService.fetchTransactionsByAccount).mockResolvedValueOnce(
      mockPageResponse
    )

    const { result } = renderHook(
      () => useTransactionHistory({ accountId: 'account-uuid' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.totalElements).toBe(1)
    expect(result.current.currentPage).toBe(0)
  })

  it('should filter by transaction type when typeFilter is set', async () => {
    vi.mocked(transferService.fetchTransactionsByAccount).mockResolvedValueOnce(
      mockPageResponse
    )

    const { result } = renderHook(
      () =>
        useTransactionHistory({
          accountId: 'account-uuid',
          typeFilter: 'INTERNAL_TRANSFER',
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.transactions).toEqual(mockPageResponse.content)
  })

  it('should reset to page 0 when typeFilter changes', async () => {
    vi.mocked(transferService.fetchTransactionsByAccount).mockResolvedValue(
      mockPageResponse
    )

    const { result } = renderHook(
      () =>
        useTransactionHistory({
          accountId: 'account-uuid',
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => {
      result.current.setTypeFilter('DEPOSIT')
    })

    expect(result.current.currentPage).toBe(0)
  })
})