import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTransactionManagement } from '../hooks/useTransactionManagement'
import * as adminTransactionService from '../services/adminTransactionService'

vi.mock('../services/adminTransactionService', () => ({
  reverseTransaction: vi.fn(),
  processDeposit: vi.fn(),
  processWithdrawal: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockTransactionResponse = {
  id: 1,
  userId: 10,
  transactionReference: 'TXN-abc123',
  transactionType: 'DEPOSIT' as const,
  status: 'COMPLETED' as const,
  sourceAccountId: 0,
  destinationAccountId: 1,
  amount: '5000.00',
  currencyCode: 'NGN',
  convertedAmount: null,
  convertedCurrencyCode: null,
  exchangeRate: null,
  description: null,
  paystackReference: null,
  failureReason: null,
  createdAt: '2026-03-14T13:00:00Z',
  updatedAt: '2026-03-14T13:00:00Z',
}

describe('useTransactionManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('should call reverseTransaction with correct id', async () => {
    vi.mocked(
      adminTransactionService.reverseTransaction
    ).mockResolvedValueOnce(mockTransactionResponse)

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.reverse(1)
    })

    expect(adminTransactionService.reverseTransaction).toHaveBeenCalledWith(1)
  })

  it('should set isSuccess true after successful reversal', async () => {
    vi.mocked(
      adminTransactionService.reverseTransaction
    ).mockResolvedValueOnce(mockTransactionResponse)

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.reverse(1)
    })

    expect(result.current.isSuccess).toBe(true)
  })

  it('should call processDeposit with correct data', async () => {
    vi.mocked(
      adminTransactionService.processDeposit
    ).mockResolvedValueOnce(mockTransactionResponse)

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.deposit({
        accountId: 1,
        transactionType: 'DEPOSIT',
        amount: '5000.00',
        currencyCode: 'NGN',
        transactionReference: 'TXN-abc123',
      })
    })

    expect(adminTransactionService.processDeposit).toHaveBeenCalledWith({
      accountId: 1,
      transactionType: 'DEPOSIT',
      amount: '5000.00',
      currencyCode: 'NGN',
      transactionReference: 'TXN-abc123',
    })
  })

  it('should call processWithdrawal with correct data', async () => {
    vi.mocked(
      adminTransactionService.processWithdrawal
    ).mockResolvedValueOnce(mockTransactionResponse)

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.withdrawal({
        accountId: 1,
        transactionType: 'WITHDRAWAL',
        amount: '2000.00',
        currencyCode: 'NGN',
        transactionReference: 'TXN-def456',
      })
    })

    expect(adminTransactionService.processWithdrawal).toHaveBeenCalledWith({
      accountId: 1,
      transactionType: 'WITHDRAWAL',
      amount: '2000.00',
      currencyCode: 'NGN',
      transactionReference: 'TXN-def456',
    })
  })

  it('should set errorMessage when operation fails', async () => {
    vi.mocked(
      adminTransactionService.reverseTransaction
    ).mockRejectedValueOnce({
      response: { data: { message: 'Transaction cannot be reversed' } },
    })

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.reverse(1)
    })

    expect(result.current.errorMessage).toBe('Transaction cannot be reversed')
  })

  it('should reset state when reset is called', async () => {
    vi.mocked(
      adminTransactionService.reverseTransaction
    ).mockResolvedValueOnce(mockTransactionResponse)

    const { result } = renderHook(() => useTransactionManagement(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.reverse(1)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isSuccess).toBe(false)
    expect(result.current.lastTransaction).toBeNull()
  })
})