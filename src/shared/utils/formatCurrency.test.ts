import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDateTime } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format a NGN string value with naira symbol', () => {
    expect(formatCurrency('50000.0000')).toBe('₦50,000.00')
  })

  it('should format a whole number string correctly', () => {
    expect(formatCurrency('1000.0000')).toBe('₦1,000.00')
  })

  it('should return ₦0.00 for invalid input', () => {
    expect(formatCurrency('invalid')).toBe('₦0.00')
  })

  it('should format USD with dollar symbol', () => {
    expect(formatCurrency('1000.00', 'USD')).toBe('$1,000.00')
  })

  it('should use currency code as symbol for unknown currencies', () => {
    expect(formatCurrency('1000.00', 'JPY')).toBe('JPY1,000.00')
  })

  it('should handle numeric input as well as string', () => {
    expect(formatCurrency(5000)).toBe('₦5,000.00')
  })
})

describe('formatDate', () => {
  it('should format an ISO date string to readable date', () => {
    const result = formatDate('2026-03-14T13:00:00Z')
    expect(result).toContain('2026')
    expect(result).toContain('14')
  })
})

describe('formatDateTime', () => {
  it('should format an ISO date string to readable date and time', () => {
    const result = formatDateTime('2026-03-14T13:00:00Z')
    expect(result).toContain('2026')
    expect(result).toContain('14')
  })
})