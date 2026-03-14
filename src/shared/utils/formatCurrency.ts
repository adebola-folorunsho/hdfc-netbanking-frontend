/*
 * Pattern: Utility function (SRP — Single Responsibility Principle)
 * Owns the single responsibility of formatting monetary values for display.
 *
 * CRITICAL — monetary values are treated as strings throughout the frontend.
 * The backend stores balances as DECIMAL(19,4). JavaScript cannot safely
 * represent large decimals with floating point arithmetic.
 * This function parses the string for display purposes ONLY —
 * no arithmetic is ever performed on monetary values in the frontend.
 */

// Formats a monetary string value for display
// Example: "50000.0000" → "₦50,000.00"
export const formatCurrency = (
  value: string | number,
  currency: string = 'NGN'
): string => {
  // Currency symbol map — extend as Currency Service adds more currencies
  const symbolMap: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  const symbol = symbolMap[currency] ?? currency

  // Parse to float for display formatting ONLY — never for arithmetic
  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return `${symbol}0.00`
  }

  // Intl.NumberFormat gives locale-aware thousands separators and decimal places
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue)

  return `${symbol}${formatted}`
}

// Formats a date string for display
// Example: "2026-03-14T13:00:00Z" → "14 Mar 2026"
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Formats a date string with time for display
// Example: "2026-03-14T13:00:00Z" → "14 Mar 2026, 1:00 PM"
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}