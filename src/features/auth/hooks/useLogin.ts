import { useState } from 'react'
import { loginUser } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'
import type { LoginRequest } from '../types/auth.types'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { setRefreshTokenCookie } from '../../../shared/utils/tokenCookie'


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

      if (response.requires2FA) {
        // 2FA required — store temp token and signal the UI to show 2FA screen
        setRequires2FA(true)
        setTempToken(response.tempToken)
        return
      }

      // Full auth success — store refresh token in cookie, access token in memory
      setRefreshTokenCookie(response.refreshToken)

      setAuth(response.accessToken, {
        userId: response.userId,
        username: response.username,
        role: response.role,
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