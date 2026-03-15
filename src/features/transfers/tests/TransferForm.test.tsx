import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import TransferForm from '../components/TransferForm'
import type { Account } from '../../dashboard/types/dashboard.types'

const mockAccounts: Account[] = [
  {
    id: 1,
    userId: 10,
    accountNumber: 'HDFC1234567890',
    accountType: 'SAVINGS',
    balance: '50000.00',
    currency: 'NGN',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const renderForm = (onSuccess = vi.fn()) =>
  render(
    <TransferForm accounts={mockAccounts} onSuccess={onSuccess} />,
    { wrapper: createWrapper() }
  )

describe('TransferForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form fields', () => {
    renderForm()
    expect(screen.getByLabelText('From Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Receiver Account Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount (NGN)')).toBeInTheDocument()
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Send Money' })
    ).toBeInTheDocument()
  })

  it('should show validation error when receiver account is empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Send Money' }))
    expect(
      screen.getByText('Receiver account number is required')
    ).toBeInTheDocument()
  })

  it('should show validation error when account number format is invalid', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(
      screen.getByLabelText('Receiver Account Number'),
      'INVALID123'
    )
    await user.click(screen.getByRole('button', { name: 'Send Money' }))
    expect(
      screen.getByText('Account number must start with HDFC followed by 10 digits')
    ).toBeInTheDocument()
  })

  it('should show validation error when amount is below minimum', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(
      screen.getByLabelText('Receiver Account Number'),
      'HDFC0987654321'
    )
    await user.type(screen.getByLabelText('Amount (NGN)'), '0')
    await user.click(screen.getByRole('button', { name: 'Send Money' }))
    expect(
      screen.getByText('Minimum transfer amount is ₦1.00')
    ).toBeInTheDocument()
  })

  it('should show validation error when amount is empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(
      screen.getByLabelText('Receiver Account Number'),
      'HDFC0987654321'
    )
    await user.click(screen.getByRole('button', { name: 'Send Money' }))
    expect(screen.getByText('Amount is required')).toBeInTheDocument()
  })
})