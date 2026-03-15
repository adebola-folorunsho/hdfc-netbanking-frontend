import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import TransactionHistoryPage from '../components/TransactionHistoryPage'
import * as useMyAccountsHook from '../../dashboard/hooks/useMyAccounts'
import * as useTransactionHistoryHook from '../hooks/useTransactionHistory'

vi.mock('../../dashboard/hooks/useMyAccounts')
vi.mock('../hooks/useTransactionHistory')

const mockUseMyAccounts = (overrides = {}) => {
  vi.mocked(useMyAccountsHook.useMyAccounts).mockReturnValue({
    accounts: [
        {
          id: 1,
          userId: 10,
          accountNumber: 'HDFC1234567890',
          accountType: 'SAVINGS' as const,
          balance: '50000.00',
          currency: 'NGN' as const,
          status: 'ACTIVE' as const,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const mockUseTransactionHistory = (overrides = {}) => {
  vi.mocked(useTransactionHistoryHook.useTransactionHistory).mockReturnValue({
    transactions: [],
    isLoading: false,
    isError: false,
    isSuccess: true,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    isFirstPage: true,
    isLastPage: true,
    typeFilter: undefined,
    setTypeFilter: vi.fn(),
    goToNextPage: vi.fn(),
    goToPreviousPage: vi.fn(),
    ...overrides,
  })
}

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(TransactionHistoryPage))
    )
  )
}

describe('TransactionHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMyAccounts()
    mockUseTransactionHistory()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  it('should render account selector dropdown', () => {
    renderPage()
    expect(screen.getByLabelText('Select Account')).toBeInTheDocument()
  })

  it('should render transaction type filter', () => {
    renderPage()
    expect(screen.getByLabelText('Filter by Type')).toBeInTheDocument()
  })

  it('should show empty state when no transactions exist', () => {
    renderPage()
    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument()
  })

  it('should render transaction rows when transactions exist', () => {
    mockUseTransactionHistory({
      transactions: [
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
    })
    renderPage()
    expect(screen.getByText('TXN-abc123')).toBeInTheDocument()
  })

  it('should render error state when fetch fails', () => {
    mockUseTransactionHistory({ isError: true, isSuccess: false })
    renderPage()
    expect(
      screen.getByText(/could not load transactions/i)
    ).toBeInTheDocument()
  })

  it('should call setTypeFilter when filter changes', async () => {
    const mockSetTypeFilter = vi.fn()
    mockUseTransactionHistory({ setTypeFilter: mockSetTypeFilter })
    const user = userEvent.setup()
    renderPage()

    await user.selectOptions(
      screen.getByLabelText('Filter by Type'),
      'INTERNAL_TRANSFER'
    )
    expect(mockSetTypeFilter).toHaveBeenCalledWith('INTERNAL_TRANSFER')
  })
})