import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import AccountManagementPage from '../components/AccountManagementPage'
import * as useAccountManagementHook from '../hooks/useAccountManagement'

vi.mock('../hooks/useAccountManagement')

const mockUseAccountManagement = (overrides = {}) => {
  vi.mocked(useAccountManagementHook.useAccountManagement).mockReturnValue({
    accounts: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    isMutating: false,
    mutationError: null,
    updateStatus: vi.fn(),
    ...overrides,
  })
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

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(AccountManagementPage))
    )
  )
}

describe('AccountManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAccountManagement()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Account Management' })
    ).toBeInTheDocument()
  })

  it('should render user ID input and search button', () => {
    renderPage()
    expect(screen.getByLabelText('User ID')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Search' })
    ).toBeInTheDocument()
  })

  it('should show validation error when user ID is empty', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(
      screen.getByText('Please enter a valid user ID')
    ).toBeInTheDocument()
  })

  it('should render account rows when accounts exist', () => {
    mockUseAccountManagement({ accounts: mockAccounts, isSuccess: true })
    renderPage()

    expect(screen.getByText('HDFC1234567890')).toBeInTheDocument()
    expect(screen.getByText('₦50,000.00')).toBeInTheDocument()
  })

  it('should show empty state when no accounts found', () => {
    mockUseAccountManagement({ accounts: [], isSuccess: true })
    renderPage()

    expect(screen.getByText(/no accounts found/i)).toBeInTheDocument()
  })

  it('should show error state when fetch fails', () => {
    mockUseAccountManagement({ isError: true })
    renderPage()

    expect(
      screen.getByText(/could not load accounts/i)
    ).toBeInTheDocument()
  })

  it('should show loading state while fetching', () => {
    mockUseAccountManagement({ isLoading: true })
    renderPage()

    expect(screen.getByText('Loading accounts...')).toBeInTheDocument()
  })
})