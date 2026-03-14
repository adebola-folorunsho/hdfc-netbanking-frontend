import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import TransferPage from '../components/TransferPage'
import * as useMyAccountsHook from '../../dashboard/hooks/useMyAccounts'

vi.mock('../../dashboard/hooks/useMyAccounts')

const mockUseMyAccounts = (overrides = {}) => {
  vi.mocked(useMyAccountsHook.useMyAccounts).mockReturnValue({
    accounts: [
      {
        id: 'account-uuid-1',
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
      createElement(MemoryRouter, null, createElement(TransferPage))
    )
  )
}

describe('TransferPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMyAccounts()
  })

  it('should render the transfer form', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Send Money' })
    ).toBeInTheDocument()
  })

  it('should render a link to transaction history', () => {
    renderPage()
    expect(
      screen.getByRole('link', { name: /view transaction history/i })
    ).toBeInTheDocument()
  })

  it('should show loading state while accounts are fetching', () => {
    mockUseMyAccounts({ isLoading: true, isSuccess: false, accounts: [] })
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show empty state when customer has no accounts', () => {
    mockUseMyAccounts({ accounts: [], isSuccess: true })
    renderPage()
    expect(screen.getByText(/no accounts available/i)).toBeInTheDocument()
  })
})