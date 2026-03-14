import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSilentRefresh } from '../hooks/useSilentRefresh'
import * as authService from '../services/authService'
import * as tokenCookie from '../../../shared/utils/tokenCookie'

vi.mock('../services/authService', () => ({
  refreshAccessToken: vi.fn(),
}))

vi.mock('../../../shared/utils/tokenCookie', () => ({
  getRefreshTokenCookie: vi.fn(),
  setRefreshTokenCookie: vi.fn(),
  removeRefreshTokenCookie: vi.fn(),
}))

describe('useSilentRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should set isResolved to true when no refresh token cookie exists', async () => {
    vi.mocked(tokenCookie.getRefreshTokenCookie).mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useSilentRefresh())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.isResolved).toBe(true)
  })

  it('should restore auth state when refresh token cookie exists and refresh succeeds', async () => {
    vi.mocked(tokenCookie.getRefreshTokenCookie).mockReturnValueOnce('valid-refresh-token')
    vi.mocked(authService.refreshAccessToken).mockResolvedValueOnce({
      requires2FA: false,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      role: 'ROLE_CUSTOMER',
      userId: '1',
      username: 'testuser',
    })

    const { result } = renderHook(() => useSilentRefresh())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.isResolved).toBe(true)
    expect(authService.refreshAccessToken).toHaveBeenCalledOnce()
  })

  it('should set isResolved to true and not throw when refresh fails', async () => {
    vi.mocked(tokenCookie.getRefreshTokenCookie).mockReturnValueOnce('expired-refresh-token')
    vi.mocked(authService.refreshAccessToken).mockRejectedValueOnce({
      response: { data: { message: 'Refresh token expired' } },
    })

    const { result } = renderHook(() => useSilentRefresh())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.isResolved).toBe(true)
  })
})