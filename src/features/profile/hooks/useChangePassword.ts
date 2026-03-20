import { useState } from 'react'
import { changeMyPassword } from '../services/profileService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { useAuthStore } from '../../../store/authStore'
import { removeRefreshTokenCookie } from '../../../shared/utils/tokenCookie'
import type { ChangePasswordRequest } from '../types/profile.types'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the password change flow and nothing else.
 * On success the backend invalidates the refresh token in Redis.
 * The frontend must clear auth state and remove the refresh token
 * cookie — the user must log in again with their new password.
 */
export const useChangePassword = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const changePassword = async (data: ChangePasswordRequest) => {
    setIsLoading(true)
    setIsSuccess(false)
    setErrorMessage(null)

    try {
      await changeMyPassword(data)
      setIsSuccess(true)

      // Backend has invalidated the refresh token in Redis.
      // Clear frontend auth state and cookie — user must re-login.
      removeRefreshTokenCookie()
      clearAuth()
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(
          error,
          'Password change failed. Please try again.'
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    changePassword,
    isLoading,
    isSuccess,
    errorMessage,
  }
}