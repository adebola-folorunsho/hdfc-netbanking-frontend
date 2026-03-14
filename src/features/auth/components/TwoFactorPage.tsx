import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useTwoFactor } from '../hooks/useTwoFactor'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the 2FA form UI and delegates all logic to useTwoFactor.
 * It reads the tempToken from router state — it does not know how it was obtained.
 * If no tempToken exists in router state, it redirects to login immediately.
 */
const TwoFactorPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // tempToken is passed via router state from LoginPage after a requires2FA response
  const tempToken = location.state?.tempToken as string | undefined

  // Guard — if someone navigates directly to /2fa without going through login,
  // there will be no tempToken. Redirect them to login immediately.
  if (!tempToken) {
    return <Navigate to="/login" replace />
  }

  const { validateOtp, isLoading, isSuccess, errorMessage } = useTwoFactor({
    tempToken,
  })

  const [otpCode, setOtpCode] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // On successful validation the auth store is updated by the hook.
  // Navigate to dashboard.
  if (isSuccess) {
    navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async () => {
    setValidationError(null)

    if (!otpCode.trim()) {
      setValidationError('Authentication code is required')
      return
    }

    await validateOtp(otpCode)
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-enter">

        {/* Brand header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold text-navy mb-1">
            HDFC NetBanking
          </h1>
          <p className="text-sm text-text-secondary">
            Two-factor authentication
          </p>
        </div>

        {/* Form card */}
        <div className="bg-surface rounded-xl shadow-card px-8 py-10">

          <div className="text-center mb-8">
            {/* Shield icon */}
            <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0
                     0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02
                     12.02 0 003 9c0 5.591 3.824 10.29 9 11.622
                     5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {/* API error message */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 px-4 py-3 rounded-input bg-red-50 border border-error text-error text-sm"
            >
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <InputField
              id="otpCode"
              label="Authentication Code"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="000000"
              error={validationError ?? undefined}
              disabled={isLoading}
              autoComplete="one-time-code"
            />

            <Button
              label="Verify Code"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingLabel="Verifying..."
              fullWidth
            />
          </div>

          {/* Back to login */}
          <p className="text-center text-sm text-text-secondary mt-8">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-navy font-medium hover:text-gold transition-colors duration-150"
            >
              Back to Sign In
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          © {new Date().getFullYear()} HDFC Bank. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default TwoFactorPage