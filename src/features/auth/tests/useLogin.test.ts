import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '../hooks/useLogin'
import * as authService from '../services/authService'

vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useLogin())
    expect(result.current.isLoading).toBe(false)
  })

  it('should call loginUser with correct credentials', async () => {
    vi.mocked(authService.loginUser).mockResolvedValueOnce({
      requires2FA: false,
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      role: 'ROLE_CUSTOMER',
      userId: '1',
      username: 'testuser',
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({
        usernameOrEmail: 'testuser',
        password: 'password123',
      })
    })

    expect(authService.loginUser).toHaveBeenCalledWith({
      usernameOrEmail: 'testuser',
      password: 'password123',
    })
  })

  it('should set errorMessage when login fails', async () => {
    vi.mocked(authService.loginUser).mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({
        usernameOrEmail: 'wronguser',
        password: 'wrongpassword',
      })
    })

    expect(result.current.errorMessage).toBe('Invalid credentials')
  })

  it('should indicate 2FA is required when backend returns requires2FA true', async () => {
    vi.mocked(authService.loginUser).mockResolvedValueOnce({
      requires2FA: true,
      tempToken: 'temp-token-123',
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({
        usernameOrEmail: 'testuser',
        password: 'password123',
      })
    })

    expect(result.current.requires2FA).toBe(true)
    expect(result.current.tempToken).toBe('temp-token-123')
  })
})