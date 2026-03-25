import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '../hooks/useLogin'
import * as authService from '../services/authService'


vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
}))

vi.mock('../../../shared/utils/tokenCookie', () => ({
  setRefreshTokenCookie: vi.fn(),
}))

// A minimal valid JWT whose payload is:
// { sub: 'test@example.com', userId: '1', role: 'ROLE_CUSTOMER' }
const MOCK_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcklkIjoiMSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIn0.signature'

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
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: 'test-refresh-token',
      tokenType: 'Bearer',
    })

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(authService.loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
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
        email: 'wrong@example.com',
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
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(result.current.requires2FA).toBe(true)
    expect(result.current.tempToken).toBe('temp-token-123')
  })
})