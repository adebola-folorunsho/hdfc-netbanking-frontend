import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import DashboardPage from '../components/DashboardPage'
import * as useMyAccountsHook from '../hooks/useMyAccounts'
import * as useMyTransactionsHook from '../hooks/useMyTransactions'

vi.mock('../hooks/useMyAccounts')
vi.mock('../hooks/useMyTransactions')

const mockUseMyAccounts = (overrides = {}) => {
  vi.mocked(useMyAccountsHook.useMyAccounts).mockReturnValue({
    accounts: [],
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const mockUseMyTransactions = (overrides = {}) => {
  vi.mocked(useMyTransactionsHook.useMyTransactions).mockReturnValue({
    transactions: [],
    isLoading: false,
    isError: false,
    isSuccess: true,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    isFirstPage: true,
    isLastPage: true,
    goToNextPage: vi.fn(),
    goToPreviousPage: vi.fn(),
    ...overrides,
  })
}

const renderDashboard = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(
        MemoryRouter,
        null,
        createElement(DashboardPage)
      )
    )
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMyAccounts()
    mockUseMyTransactions()
  })

  it('should render the dashboard heading', () => {
    renderDashboard()
    expect(screen.getByText('My Accounts')).toBeInTheDocument()
  })

  it('should render account cards when accounts exist', () => {
    mockUseMyAccounts({
      accounts: [
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
      ],
    })

    renderDashboard()
    expect(screen.getByText('HDFC1234567890')).toBeInTheDocument()
  })

  it('should show empty state when no accounts exist', () => {
    mockUseMyAccounts({ accounts: [] })
    renderDashboard()
    expect(screen.getByText(/no accounts found/i)).toBeInTheDocument()
  })

  it('should show loading state while accounts are fetching', () => {
    mockUseMyAccounts({ isLoading: true, isSuccess: false })
    renderDashboard()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when accounts fetch fails', () => {
    mockUseMyAccounts({ isError: true, isSuccess: false })
    renderDashboard()
    expect(screen.getByText(/could not load accounts/i)).toBeInTheDocument()
  })

  it('should render recent transactions heading', () => {
    renderDashboard()
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  it('should show empty state when no transactions exist', () => {
    mockUseMyTransactions({ transactions: [] })
    renderDashboard()
    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument()
  })
})