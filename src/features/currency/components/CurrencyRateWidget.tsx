import { useState } from 'react'
import { useCurrencyRate } from '../hooks/useCurrencyRate'
import { useSupportedCurrencies } from '../hooks/useSupportedCurrencies'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the exchange rate widget UI and nothing else.
 * It delegates data fetching to useCurrencyRate and useSupportedCurrencies.
 * No API calls, no business logic — all of that lives in the hooks.
 *
 * Dashboard widget — shows NGN rate against one selected currency.
 * No amount input — rate display only.
 */
const CurrencyRateWidget = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const { currencies } = useSupportedCurrencies()
  const { rate, isLoading, isError } = useCurrencyRate({
    from: 'NGN',
    to: selectedCurrency,
  })

  // Filter out NGN from the dropdown — no point showing NGN to NGN
  const targetCurrencies = currencies.filter((c) => c !== 'NGN')

  return (
    <div className="bg-surface rounded-xl shadow-card p-6 border border-gray-100">

      {/* Widget header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase
                       tracking-wider">
          Exchange Rate
        </h3>

        {/* Currency selector */}
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="text-xs font-medium text-navy border border-gray-200
                     rounded-input px-2 py-1 bg-surface
                     focus:outline-none focus:ring-2 focus:ring-gold
                     focus:border-transparent transition-colors duration-150"
          aria-label="Select target currency"
        >
          {targetCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {/* Rate display */}
      {isLoading && (
        <p className="text-sm text-text-muted">Loading rate...</p>
      )}

      {isError && (
        <p className="text-sm text-error">Rate unavailable</p>
      )}

      {!isLoading && !isError && rate && (
        <div>
          <p className="text-xs text-text-muted mb-1">
            1 <span className="font-medium text-navy">NGN</span> =
          </p>
          <p className="font-display text-2xl font-semibold text-navy">
            {rate.rate.toFixed(6)}{' '}
            <span className="text-base font-body font-medium text-gold">
              {rate.toCurrency}
            </span>
          </p>
          <p className="text-xs text-text-muted mt-2">
            Updated {new Date(rate.fetchedAt).toLocaleTimeString('en-NG', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default CurrencyRateWidget