import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useSupportedCurrencies } from '../hooks/useSupportedCurrencies'
import * as currencyService from '../services/currencyService'

vi.mock('../services/currencyService', () => ({
  fetchSupportedCurrencies: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockCurrencies = ['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY', 'GHS', 'KES', 'ZAR']

describe('useSupportedCurrencies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return supported currencies on successful fetch', async () => {
    vi.mocked(currencyService.fetchSupportedCurrencies).mockResolvedValueOnce(
      mockCurrencies
    )

    const { result } = renderHook(() => useSupportedCurrencies(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.currencies).toEqual(mockCurrencies)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(currencyService.fetchSupportedCurrencies).mockResolvedValueOnce(
      mockCurrencies
    )

    const { result } = renderHook(() => useSupportedCurrencies(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(
      currencyService.fetchSupportedCurrencies
    ).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useSupportedCurrencies(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty array when no currencies returned', async () => {
    vi.mocked(currencyService.fetchSupportedCurrencies).mockResolvedValueOnce(
      []
    )

    const { result } = renderHook(() => useSupportedCurrencies(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.currencies).toEqual([])
  })
})