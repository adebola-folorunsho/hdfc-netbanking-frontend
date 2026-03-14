import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { useAuthStore } from '../../../store/authStore'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the login form UI and delegates all logic to useLogin.
 * It handles local form state and validation feedback only.
 * No API calls, no auth logic — all of that lives in the hook.
 * Role-based redirect after login is handled via useEffect — not inline.
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading, errorMessage, requires2FA, tempToken } = useLogin()
  const { user, isAuthenticated } = useAuthStore()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // When backend signals 2FA is required, navigate to the 2FA page
  // passing the tempToken via router state so TwoFactorPage can access it
  useEffect(() => {
    if (requires2FA && tempToken) {
      navigate('/2fa', { state: { tempToken } })
    }
  }, [requires2FA, tempToken, navigate])

  // Role-based redirect after successful login
  // Runs whenever isAuthenticated or user changes
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const roleRedirectMap: Record<string, string> = {
      ROLE_CUSTOMER: '/dashboard',
      ROLE_TELLER: '/teller',
      ROLE_ADMIN: '/admin',
    }

    const destination = roleRedirectMap[user.role] ?? '/dashboard'
    navigate(destination, { replace: true })
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async () => {
    setValidationError(null)

    // Client-side validation — check required fields before hitting the API
    if (!usernameOrEmail.trim()) {
      setValidationError('Username or email is required')
      return
    }

    if (!password.trim()) {
      setValidationError('Password is required')
      return
    }

    await login({ usernameOrEmail, password })
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
            Sign in to your account
          </p>
        </div>

        {/* Form card */}
        <div className="bg-surface rounded-xl shadow-card px-8 py-10">

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
              id="usernameOrEmail"
              label="Username or Email"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter your username or email"
              error={validationError && !usernameOrEmail.trim()
                ? validationError
                : undefined
              }
              disabled={isLoading}
              autoComplete="username"
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={validationError && !password.trim() && usernameOrEmail.trim()
                ? validationError
                : undefined
              }
              disabled={isLoading}
              autoComplete="current-password"
            />

            <Button
              label="Sign In"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingLabel="Signing in..."
              fullWidth
            />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-text-secondary mt-8">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-navy font-medium hover:text-gold transition-colors duration-150"
            >
              Create an account
            </Link>
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

export default LoginPage