import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTransfer } from '../hooks/useTransfer'
import * as transferService from '../services/transferService'

vi.mock('../services/transferService', () => ({
  initiateTransfer: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockTransferResponse = {
  id: '1',
  senderAccountId: 'sender-uuid',
  receiverAccountId: 'receiver-uuid',
  amount: '1000.0000',
  currency: 'NGN' as const,
  status: 'SUCCESS' as const,
  type: 'INTERNAL_TRANSFER' as const,
  reference: 'TXN-abc123',
  createdAt: '2026-03-14T13:00:00Z',
}

describe('useTransfer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useTransfer(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('should call initiateTransfer with correct data', async () => {
    vi.mocked(transferService.initiateTransfer).mockResolvedValueOnce(
      mockTransferResponse
    )

    const { result } = renderHook(() => useTransfer(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.transfer({
        senderAccountId: 'sender-uuid',
        receiverAccountId: 'receiver-uuid',
        amount: 1000,
        currency: 'NGN',
      })
    })

    expect(transferService.initiateTransfer).toHaveBeenCalledWith({
      senderAccountId: 'sender-uuid',
      receiverAccountId: 'receiver-uuid',
      amount: 1000,
      currency: 'NGN',
    })
  })

  it('should set isSuccess true when transfer succeeds', async () => {
    vi.mocked(transferService.initiateTransfer).mockResolvedValueOnce(
      mockTransferResponse
    )

    const { result } = renderHook(() => useTransfer(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.transfer({
        senderAccountId: 'sender-uuid',
        receiverAccountId: 'receiver-uuid',
        amount: 1000,
        currency: 'NGN',
      })
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.transferredTransaction).toEqual(mockTransferResponse)
  })

  it('should set errorMessage when transfer fails', async () => {
    vi.mocked(transferService.initiateTransfer).mockRejectedValueOnce({
      response: { data: { message: 'Insufficient balance' } },
    })

    const { result } = renderHook(() => useTransfer(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.transfer({
        senderAccountId: 'sender-uuid',
        receiverAccountId: 'receiver-uuid',
        amount: 1000,
        currency: 'NGN',
      })
    })

    expect(result.current.errorMessage).toBe('Insufficient balance')
  })

  it('should reset state when reset is called', async () => {
    vi.mocked(transferService.initiateTransfer).mockResolvedValueOnce(
      mockTransferResponse
    )

    const { result } = renderHook(() => useTransfer(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.transfer({
        senderAccountId: 'sender-uuid',
        receiverAccountId: 'receiver-uuid',
        amount: 1000,
        currency: 'NGN',
      })
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isSuccess).toBe(false)
    expect(result.current.transferredTransaction).toBeNull()
  })
})