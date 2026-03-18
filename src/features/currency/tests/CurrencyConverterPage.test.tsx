import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import CurrencyConverterPage from '../components/CurrencyConverterPage'
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
    currencies: ['NGN', 'USD', 'GBP', 'EUR'],
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(CurrencyConverterPage))
    )
  )
}

describe('CurrencyConverterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCurrencyRate()
    mockUseSupportedCurrencies()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Currency Converter' })
    ).toBeInTheDocument()
  })

  it('should render amount input field', () => {
    renderPage()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
  })

  it('should render from and to currency selectors', () => {
    renderPage()
    expect(screen.getByLabelText('From')).toBeInTheDocument()
    expect(screen.getByLabelText('To')).toBeInTheDocument()
  })

  it('should show converted amount when rate is available', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Amount'), '1000')
    expect(screen.getByText('Converted Amount')).toBeInTheDocument()
  })

  it('should show loading state while rate is fetching', () => {
    mockUseCurrencyRate({ isLoading: true, isSuccess: false, rate: null })
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when rate fetch fails', () => {
    mockUseCurrencyRate({ isError: true, isSuccess: false, rate: null })
    renderPage()
    expect(screen.getByText(/could not fetch/i)).toBeInTheDocument()
  })

  it('should render a link back to dashboard', () => {
    renderPage()
    expect(
      screen.getByRole('link', { name: /back to dashboard/i })
    ).toBeInTheDocument()
  })
})