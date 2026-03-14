import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRegister } from '../hooks/useRegister'
import * as authService from '../services/authService'

vi.mock('../services/authService', () => ({
  registerUser: vi.fn(),
}))

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useRegister())
    expect(result.current.isLoading).toBe(false)
  })

  it('should call registerUser with correct data', async () => {
    vi.mocked(authService.registerUser).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        phoneNumber: '08012345678',
      })
    })

    expect(authService.registerUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      phoneNumber: '08012345678',
    })
  })

  it('should set isSuccess to true when registration succeeds', async () => {
    vi.mocked(authService.registerUser).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        phoneNumber: '08012345678',
      })
    })

    expect(result.current.isSuccess).toBe(true)
  })

  it('should set errorMessage when registration fails', async () => {
    vi.mocked(authService.registerUser).mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    })

    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        phoneNumber: '08012345678',
      })
    })

    expect(result.current.errorMessage).toBe('Email already exists')
  })
})