import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TransactionStatusBadge from '../components/TransactionStatusBadge'

describe('TransactionStatusBadge', () => {
  it('should render SUCCESS status correctly', () => {
    render(<TransactionStatusBadge status="SUCCESS" />)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('should render PENDING status correctly', () => {
    render(<TransactionStatusBadge status="PENDING" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('should render FAILED status correctly', () => {
    render(<TransactionStatusBadge status="FAILED" />)
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })
})