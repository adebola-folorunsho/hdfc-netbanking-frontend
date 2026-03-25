import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { loginUser } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'
import type { LoginRequest, TwoFactorRequiredResponse } from '../types/auth.types'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { setRefreshTokenCookie } from '../../../shared/utils/tokenCookie'

// Represents the claims we expect inside the access token payload.
// The backend sets sub (email), userId, and role — nothing else is relied upon.
interface AccessTokenPayload {
  sub: string
  userId: string
  role: 'ROLE_CUSTOMER' | 'ROLE_TELLER' | 'ROLE_ADMIN'
}

/*
 * Pattern: Type Guard (Strategy for union narrowing)
 * LoginResponse is a discriminated union — requires2FA is the discriminant.
 * This guard centralises the narrowing logic so the hook body stays clean.
 * Without this, TypeScript cannot safely access tempToken or accessToken.
 */
const isTwoFactorRequired = (
  response: unknown
): response is TwoFactorRequiredResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'requires2FA' in response &&
    (response as TwoFactorRequiredResponse).requires2FA === true
  )
}

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the login flow and nothing else.
 * It bridges the auth service and the auth store.
 * The component that uses this hook only deals with UI — never with API logic.
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await loginUser(credentials)

      if (isTwoFactorRequired(response)) {
        // 2FA required — store temp token and signal the UI to show 2FA screen
        setRequires2FA(true)
        setTempToken(response.tempToken)
        return
      }

      // Full auth success — store refresh token in cookie, access token in memory
      setRefreshTokenCookie(response.refreshToken)

      const decoded = jwtDecode<AccessTokenPayload>(response.accessToken)

      setAuth(response.accessToken, {
        userId: decoded.userId,
        email: decoded.sub,
        role: decoded.role,
      })
    } catch (error: unknown) {
      setErrorMessage(extractErrorMessage(error, 'Login failed. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    errorMessage,
    requires2FA,
    tempToken,
  }
}