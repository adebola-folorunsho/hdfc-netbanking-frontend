import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TransactionRow from '../components/TransactionRow'

const mockTransaction = {
  id: '1',
  senderAccountId: '10',
  receiverAccountId: '20',
  amount: '5000.0000',
  currency: 'NGN' as const,
  status: 'SUCCESS' as const,
  type: 'INTERNAL_TRANSFER' as const,
  reference: 'TXN-abc123',
  createdAt: '2026-03-14T13:00:00Z',
}

describe('TransactionRow', () => {
  it('should render the transaction reference', () => {
    render(
      <table>
        <tbody>
          <TransactionRow transaction={mockTransaction} />
        </tbody>
      </table>
    )
    expect(screen.getByText('TXN-abc123')).toBeInTheDocument()
  })

  it('should render the formatted amount', () => {
    render(
      <table>
        <tbody>
          <TransactionRow transaction={mockTransaction} />
        </tbody>
      </table>
    )
    expect(screen.getByText('₦5,000.00')).toBeInTheDocument()
  })

  it('should render the transaction type label', () => {
    render(
      <table>
        <tbody>
          <TransactionRow transaction={mockTransaction} />
        </tbody>
      </table>
    )
    expect(screen.getByText('Internal Transfer')).toBeInTheDocument()
  })

  it('should render the status badge', () => {
    render(
      <table>
        <tbody>
          <TransactionRow transaction={mockTransaction} />
        </tbody>
      </table>
    )
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})