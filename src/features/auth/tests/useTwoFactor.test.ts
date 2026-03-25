import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTwoFactor } from '../hooks/useTwoFactor'
import * as authService from '../services/authService'

vi.mock('../services/authService', () => ({
  validateTwoFactor: vi.fn(),
}))

describe('useTwoFactor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() =>
      useTwoFactor({ tempToken: 'temp-token-123' })
    )
    expect(result.current.isLoading).toBe(false)
  })

  it('should call validateTwoFactor with correct data', async () => {
    vi.mocked(authService.validateTwoFactor).mockResolvedValueOnce({
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcklkIjoiMSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIn0.signature',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
    })

    const { result } = renderHook(() =>
      useTwoFactor({ tempToken: 'temp-token-123' })
    )

    await act(async () => {
      await result.current.validateOtp('123456')
    })

    expect(authService.validateTwoFactor).toHaveBeenCalledWith({
      tempToken: 'temp-token-123',
      totpCode: '123456',
    })
  })

  it('should set errorMessage when validation fails', async () => {
    vi.mocked(authService.validateTwoFactor).mockRejectedValueOnce({
      response: { data: { message: 'Invalid OTP code' } },
    })

    const { result } = renderHook(() =>
      useTwoFactor({ tempToken: 'temp-token-123' })
    )

    await act(async () => {
      await result.current.validateOtp('000000')
    })

    expect(result.current.errorMessage).toBe('Invalid OTP code')
  })

  it('should set isSuccess to true when validation succeeds', async () => {
    vi.mocked(authService.validateTwoFactor).mockResolvedValueOnce({
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcklkIjoiMSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIn0.signature',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
    })

    const { result } = renderHook(() =>
      useTwoFactor({ tempToken: 'temp-token-123' })
    )

    await act(async () => {
      await result.current.validateOtp('123456')
    })

    expect(result.current.isSuccess).toBe(true)
  })
})