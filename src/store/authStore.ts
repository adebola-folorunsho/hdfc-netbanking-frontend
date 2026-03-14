import { create } from 'zustand'
import type { AuthUser } from '../features/auth/types/auth.types'

interface AuthState {
  // The access token lives in memory only — never in localStorage or sessionStorage
  // Lost on page refresh — silent refresh via httpOnly cookie handles re-hydration
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean

  // Actions
  setAuth: (accessToken: string, user: AuthUser) => void
  clearAuth: () => void
}

/*
 * Pattern: Zustand store as a focused context (ISP — Interface Segregation)
 * Only auth-related state lives here. No other global state is mixed in.
 * Components that need auth state subscribe only to what they need.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}))