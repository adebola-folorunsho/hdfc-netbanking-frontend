import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the registration form UI and delegates all logic
 * to useRegister. It handles local form state and validation only.
 */
const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isLoading, isSuccess, errorMessage } = useRegister()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validationField, setValidationField] = useState<string | null>(null)

  const handleSubmit = async () => {
    setValidationError(null)
    setValidationField(null)

    // Client-side validation — check required fields before hitting the API
    if (!firstName.trim()) {
      setValidationError('First name is required')
      setValidationField('firstName')
      return
    }
    if (!lastName.trim()) {
      setValidationError('Last name is required')
      setValidationField('lastName')
      return
    }
    if (!email.trim()) {
      setValidationError('Email address is required')
      setValidationField('email')
      return
    }
    if (!username.trim()) {
      setValidationError('Username is required')
      setValidationField('username')
      return
    }
    if (!password.trim()) {
      setValidationError('Password is required')
      setValidationField('password')
      return
    }
    if (!phoneNumber.trim()) {
      setValidationError('Phone number is required')
      setValidationField('phoneNumber')
      return
    }

    await register({
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
    })
  }

  // Success state — show confirmation and redirect link
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-enter text-center">
          <div className="bg-surface rounded-xl shadow-card px-8 py-10">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold text-navy mb-2">
              Account created successfully
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Your account has been created. You can now sign in.
            </p>
            <Button
              label="Go to Sign In"
              onClick={() => navigate('/login')}
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-enter">

        {/* Brand header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold text-navy mb-1">
            HDFC NetBanking
          </h1>
          <p className="text-sm text-text-secondary">
            Create your account
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
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="firstName"
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                error={validationField === 'firstName'
                  ? validationError ?? undefined
                  : undefined
                }
                disabled={isLoading}
                autoComplete="given-name"
              />
              <InputField
                id="lastName"
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                error={validationField === 'lastName'
                  ? validationError ?? undefined
                  : undefined
                }
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>

            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              error={validationField === 'email'
                ? validationError ?? undefined
                : undefined
              }
              disabled={isLoading}
              autoComplete="email"
            />

            <InputField
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              error={validationField === 'username'
                ? validationError ?? undefined
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
              placeholder="Create a strong password"
              error={validationField === 'password'
                ? validationError ?? undefined
                : undefined
              }
              disabled={isLoading}
              autoComplete="new-password"
            />

            <InputField
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              error={validationField === 'phoneNumber'
                ? validationError ?? undefined
                : undefined
              }
              disabled={isLoading}
              autoComplete="tel"
            />

            <Button
              label="Create Account"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingLabel="Creating account..."
              fullWidth
            />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-text-secondary mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-navy font-medium hover:text-gold transition-colors duration-150"
            >
              Sign in
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

export default RegisterPage