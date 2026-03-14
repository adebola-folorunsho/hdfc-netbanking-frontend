import { useState, useEffect } from 'react'
import { refreshAccessToken } from '../services/authService'
import { useAuthStore } from '../../../store/authStore'
import {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  removeRefreshTokenCookie,
} from '../../../shared/utils/tokenCookie'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the silent refresh flow and nothing else.
 * It runs once on mount — checks for a refresh token cookie,
 * attempts to restore the access token, then signals it is done.
 *
 * The app must not render protected routes until isResolved is true —
 * otherwise a valid user gets redirected to login on every page refresh.
 */
export const useSilentRefresh = () => {
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  // isResolved signals that the silent refresh attempt is complete —
  // regardless of whether it succeeded or failed.
  // The app waits for this before rendering any routes.
  const [isResolved, setIsResolved] = useState(false)

  useEffect(() => {
    const attemptSilentRefresh = async () => {
      const refreshToken = getRefreshTokenCookie()

      // No refresh token cookie — user is not logged in, nothing to restore
      if (!refreshToken) {
        setIsResolved(true)
        return
      }

      try {
        const response = await refreshAccessToken()

        // Rotate the refresh token cookie with the new one from the response
        setRefreshTokenCookie(response.refreshToken)

        setAuth(response.accessToken, {
          userId: response.userId,
          username: response.username,
          role: response.role,
        })
      } catch {
        // Refresh token is expired or invalid — clear everything and
        // let the user log in again
        removeRefreshTokenCookie()
        clearAuth()
      } finally {
        setIsResolved(true)
      }
    }

    attemptSilentRefresh()
  }, [setAuth, clearAuth])

  return { isResolved }
}