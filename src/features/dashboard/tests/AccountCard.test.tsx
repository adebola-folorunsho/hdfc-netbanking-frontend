import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AccountCard from '../components/AccountCard'

const mockAccount = {
  id: '1',
  userId: '10',
  accountNumber: 'HDFC1234567890',
  accountType: 'SAVINGS' as const,
  balance: '50000.0000',
  currency: 'NGN' as const,
  status: 'ACTIVE' as const,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('AccountCard', () => {
  it('should render the account number', () => {
    render(<AccountCard account={mockAccount} />)
    expect(screen.getByText('HDFC1234567890')).toBeInTheDocument()
  })

  it('should render the account type', () => {
    render(<AccountCard account={mockAccount} />)
    expect(screen.getByText('Savings Account')).toBeInTheDocument()
  })

  it('should render the formatted balance', () => {
    render(<AccountCard account={mockAccount} />)
    expect(screen.getByText('₦50,000.00')).toBeInTheDocument()
  })

  it('should render the account status', () => {
    render(<AccountCard account={mockAccount} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should render frozen status correctly', () => {
    render(<AccountCard account={{ ...mockAccount, status: 'FROZEN' }} />)
    expect(screen.getByText('Frozen')).toBeInTheDocument()
  })
})