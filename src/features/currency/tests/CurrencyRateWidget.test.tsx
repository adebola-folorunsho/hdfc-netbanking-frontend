import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import CurrencyRateWidget from '../components/CurrencyRateWidget'
import * as useCurrencyRateHook from '../hooks/useCurrencyRate'
import * as useSupportedCurrenciesHook from '../hooks/useSupportedCurrencies'

vi.mock('../hooks/useCurrencyRate')
vi.mock('../hooks/useSupportedCurrencies')

const mockUseCurrencyRate = (overrides = {}) => {
  vi.mocked(useCurrencyRateHook.useCurrencyRate).mockReturnValue({
    rate: {
      fromCurrency: 'NGN',
      toCurrency: 'USD',
      rate: 0.00065,
      fetchedAt: '2026-03-14T12:00:00Z',
    },
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const mockUseSupportedCurrencies = (overrides = {}) => {
  vi.mocked(useSupportedCurrenciesHook.useSupportedCurrencies).mockReturnValue({
    currencies: ['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY', 'GHS', 'KES', 'ZAR'],
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const renderWidget = () =>
  render(<CurrencyRateWidget />, { wrapper: createWrapper() })

describe('CurrencyRateWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCurrencyRate()
    mockUseSupportedCurrencies()
  })

  it('should render the widget heading', () => {
    renderWidget()
    expect(screen.getByText('Exchange Rate')).toBeInTheDocument()
  })

  it('should render the current rate', () => {
    renderWidget()
    expect(screen.getByText(/0.00065/)).toBeInTheDocument()
  })

  it('should render NGN as the base currency', () => {
    renderWidget()
    expect(screen.getByText(/NGN/)).toBeInTheDocument()
  })

  it('should render a currency selector dropdown', () => {
    renderWidget()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should show loading state while rate is fetching', () => {
    mockUseCurrencyRate({ isLoading: true, isSuccess: false, rate: null })
    renderWidget()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when rate fetch fails', () => {
    mockUseCurrencyRate({ isError: true, isSuccess: false, rate: null })
    renderWidget()
    expect(screen.getByText(/unavailable/i)).toBeInTheDocument()
  })

  it('should update selected currency when dropdown changes', async () => {
    const user = userEvent.setup()
    renderWidget()

    await user.selectOptions(screen.getByRole('combobox'), 'GBP')
    expect(screen.getByRole('combobox')).toHaveValue('GBP')
  })
})