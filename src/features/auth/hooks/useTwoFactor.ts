import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { validateTwoFactor } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { setRefreshTokenCookie } from '../../../shared/utils/tokenCookie'


interface UseTwoFactorProps {
  tempToken: string
}

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the 2FA validation flow and nothing else.
 * It receives the tempToken as a prop — it does not know how it was obtained.
 * The parent component (or useLogin hook) owns that responsibility.
 */
export const useTwoFactor = ({ tempToken }: UseTwoFactorProps) => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateOtp = async (totpCode: string) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await validateTwoFactor({ tempToken, totpCode })

      // SECURITY TRADE-OFF: refresh token stored in js-cookie, not a true httpOnly cookie.
      // True httpOnly requires server-side Set-Cookie header. Deferred — see GitHub issue.
      setRefreshTokenCookie(response.refreshToken)

      const decoded = jwtDecode<{ sub: string; userId: string; role: 'ROLE_CUSTOMER' | 'ROLE_TELLER' | 'ROLE_ADMIN' }>(response.accessToken)

      setAuth(response.accessToken, {
        userId: decoded.userId,
        username: decoded.sub,
        role: decoded.role,
      })

      setIsSuccess(true)
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, 'OTP validation failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    validateOtp,
    isLoading,
    isSuccess,
    errorMessage,
  }
}