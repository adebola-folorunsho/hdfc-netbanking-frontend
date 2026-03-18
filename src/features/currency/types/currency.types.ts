// Exchange rate response — matches Currency Service ExchangeRateResponse
export interface ExchangeRate {
  fromCurrency: string
  toCurrency: string
  // Rate is a number here — used for display formatting only, never arithmetic
  rate: number
  fetchedAt: string
}

// Supported currencies response — matches GET /api/v1/currency/supported
export type SupportedCurrencies = string[]

// Currency option for dropdowns
export interface CurrencyOption {
  code: string
  label: string
}