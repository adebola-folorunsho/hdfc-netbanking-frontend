import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCurrencyRate } from '../hooks/useCurrencyRate'
import * as currencyService from '../services/currencyService'

vi.mock('../services/currencyService', () => ({
  fetchExchangeRate: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockRate = {
  fromCurrency: 'NGN',
  toCurrency: 'USD',
  rate: 0.00065,
  fetchedAt: '2026-03-14T12:00:00Z',
}

describe('useCurrencyRate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return exchange rate on successful fetch', async () => {
    vi.mocked(currencyService.fetchExchangeRate).mockResolvedValueOnce(
      mockRate
    )

    const { result } = renderHook(
      () => useCurrencyRate({ from: 'NGN', to: 'USD' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.rate).toEqual(mockRate)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(currencyService.fetchExchangeRate).mockResolvedValueOnce(
      mockRate
    )

    const { result } = renderHook(
      () => useCurrencyRate({ from: 'NGN', to: 'USD' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(currencyService.fetchExchangeRate).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(
      () => useCurrencyRate({ from: 'NGN', to: 'USD' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should not fetch when from and to are the same currency', async () => {
    const { result } = renderHook(
      () => useCurrencyRate({ from: 'NGN', to: 'NGN' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(currencyService.fetchExchangeRate).not.toHaveBeenCalled()
  })

  it('should return null rate when from equals to', async () => {
    const { result } = renderHook(
      () => useCurrencyRate({ from: 'NGN', to: 'NGN' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.rate).toBeNull()
  })
})