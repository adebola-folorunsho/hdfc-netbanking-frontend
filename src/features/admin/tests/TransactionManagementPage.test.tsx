import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import TransactionManagementPage from '../components/TransactionManagementPage'
import * as useTransactionManagementHook from '../hooks/useTransactionManagement'

vi.mock('../hooks/useTransactionManagement')

const mockUseTransactionManagement = (overrides = {}) => {
  vi.mocked(
    useTransactionManagementHook.useTransactionManagement
  ).mockReturnValue({
    reverse: vi.fn(),
    deposit: vi.fn(),
    withdrawal: vi.fn(),
    reset: vi.fn(),
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    lastTransaction: null,
    ...overrides,
  })
}

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(
        MemoryRouter,
        null,
        createElement(TransactionManagementPage)
      )
    )
  )
}

describe('TransactionManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTransactionManagement()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Transaction Management' })
    ).toBeInTheDocument()
  })

  it('should render the reverse transaction section', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Reverse Transaction' })
    ).toBeInTheDocument()
  })

  it('should render the deposit section', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Process Deposit' })
    ).toBeInTheDocument()
  })

  it('should render the withdrawal section', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Process Withdrawal' })
    ).toBeInTheDocument()
  })

  it('should show validation error when transaction ID is empty on reverse', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Reverse' }))
    expect(
      screen.getByText('Please enter a valid transaction ID')
    ).toBeInTheDocument()
  })

  it('should call reverse with correct transaction ID', async () => {
    const mockReverse = vi.fn()
    mockUseTransactionManagement({ reverse: mockReverse })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Transaction ID'), '42')
    await user.click(screen.getByRole('button', { name: 'Reverse' }))

    expect(mockReverse).toHaveBeenCalledWith(42)
  })

  it('should show error message when operation fails', () => {
    mockUseTransactionManagement({
      errorMessage: 'Transaction cannot be reversed',
    })
    renderPage()

    expect(
      screen.getByText('Transaction cannot be reversed')
    ).toBeInTheDocument()
  })

  it('should show success state after operation completes', () => {
    mockUseTransactionManagement({ isSuccess: true })
    renderPage()

    expect(screen.getByText(/operation completed/i)).toBeInTheDocument()
  })
})