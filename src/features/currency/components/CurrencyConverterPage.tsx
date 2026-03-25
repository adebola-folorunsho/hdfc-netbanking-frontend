import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrencyRate } from '../hooks/useCurrencyRate'
import { useSupportedCurrencies } from '../hooks/useSupportedCurrencies'
import { useAuthStore } from '../../../store/authStore'
import Button from '../../../shared/components/Button'
import InputField from '../../../shared/components/InputField'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the currency converter page UI.
 * It delegates rate fetching to useCurrencyRate and
 * currency list fetching to useSupportedCurrencies.
 * Conversion calculation is display-only — no monetary arithmetic.
 */
const CurrencyConverterPage = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('NGN')
  const [toCurrency, setToCurrency] = useState('USD')

  const { currencies } = useSupportedCurrencies()
  const { rate, isLoading, isError } = useCurrencyRate({
    from: fromCurrency,
    to: toCurrency,
  })

  // Conversion is display-only — parseFloat used only for formatting
  // No arithmetic stored or passed to any other system
  const convertedAmount =
    amount && rate
      ? (parseFloat(amount) * rate.rate).toFixed(2)
      : null

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  // Swap from and to currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="min-h-screen bg-app">

      {/* Top navigation bar */}
      <header className="bg-navy shadow-elevated">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center
                        justify-between">
          <h1 className="font-display text-xl font-semibold text-surface">
            HDFC NetBanking
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Dashboard
            </button>
            <span className="text-sm text-gray-300">
              Welcome, {user?.email}
            </span>
            <Button
              label="Sign Out"
              onClick={handleLogout}
              variant="secondary"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-lg mx-auto">

          {/* Page heading */}
          <h2 className="font-display text-2xl font-semibold text-navy mb-8">
            Currency Converter
          </h2>

          <div className="bg-surface rounded-xl shadow-card px-8 py-10">
            <div className="flex flex-col gap-6">

              {/* Amount input */}
              <InputField
                id="amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000.00"
                autoComplete="off"
              />

              {/* Currency selectors */}
              <div className="flex items-end gap-3">

                {/* From currency */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    htmlFor="fromCurrency"
                    className="text-sm font-medium text-navy"
                  >
                    From
                  </label>
                  <select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-input border
                               border-gray-200 text-sm font-body bg-surface
                               text-navy focus:outline-none focus:ring-2
                               focus:ring-gold focus:border-transparent
                               transition-colors duration-150"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap button */}
                <button
                  type="button"
                  onClick={handleSwap}
                  className="mb-0.5 p-2.5 rounded-input border border-gray-200
                             text-text-secondary hover:text-navy hover:border-navy
                             transition-colors duration-150"
                  aria-label="Swap currencies"
                >
                  ⇄
                </button>

                {/* To currency */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    htmlFor="toCurrency"
                    className="text-sm font-medium text-navy"
                  >
                    To
                  </label>
                  <select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-input border
                               border-gray-200 text-sm font-body bg-surface
                               text-navy focus:outline-none focus:ring-2
                               focus:ring-gold focus:border-transparent
                               transition-colors duration-150"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rate and result display */}
              <div className="bg-app rounded-xl p-6 border border-gray-100">

                {/* Loading state */}
                {isLoading && (
                  <p className="text-sm text-text-muted">
                    Loading exchange rate...
                  </p>
                )}

                {/* Error state */}
                {isError && (
                  <p className="text-sm text-error">
                    Could not fetch exchange rate. Please try again.
                  </p>
                )}

                {/* Same currency */}
                {!isLoading && !isError && fromCurrency === toCurrency && (
                  <p className="text-sm text-text-muted">
                    Select two different currencies to see the exchange rate.
                  </p>
                )}

                {/* Rate and converted amount */}
                {!isLoading && !isError && rate && fromCurrency !== toCurrency && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        Exchange Rate
                      </p>
                      <p className="text-sm font-medium text-navy">
                        1 {fromCurrency} = {rate.rate.toFixed(6)} {toCurrency}
                      </p>
                    </div>

                    {convertedAmount && (
                      <div>
                        <p className="text-xs text-text-muted mb-1">
                          Converted Amount
                        </p>
                        <p className="font-display text-3xl font-semibold
                                      text-navy">
                          {convertedAmount}{' '}
                          <span className="text-lg font-body font-medium
                                           text-gold">
                            {toCurrency}
                          </span>
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-text-muted">
                      Rate updated{' '}
                      {new Date(rate.fetchedAt).toLocaleTimeString('en-NG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to dashboard link */}
          <div className="text-center mt-6">
            <Link
              to="/dashboard"
              className="text-sm text-navy font-medium hover:text-gold
                         transition-colors duration-150"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CurrencyConverterPage