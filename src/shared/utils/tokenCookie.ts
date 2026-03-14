import Cookies from 'js-cookie'

const REFRESH_TOKEN_KEY = 'refreshToken'

/*
 * Pattern: Utility module (SRP — Single Responsibility Principle)
 * Owns all refresh token cookie operations and nothing else.
 *
 * DRY — centralises cookie logic so if the cookie name, options, or
 * storage strategy ever changes, only this file changes.
 *
 * SECURITY TRADE-OFF: js-cookie cannot set a true httpOnly cookie —
 * that requires a server-side Set-Cookie header. This is the closest
 * client-side approximation. Deferred — see GitHub issue.
 */

export const setRefreshTokenCookie = (refreshToken: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    // Ensures cookie is only sent over HTTPS in production
    secure: true,
    // Prevents cookie from being sent in cross-site requests — mitigates CSRF
    sameSite: 'strict',
  })
}

export const getRefreshTokenCookie = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export const removeRefreshTokenCookie = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY)
}