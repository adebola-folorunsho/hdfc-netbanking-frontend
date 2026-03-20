import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useChangePassword } from '../hooks/useChangePassword'
import * as profileService from '../services/profileService'

vi.mock('../services/profileService', () => ({
  changeMyPassword: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('should call changeMyPassword with correct data', async () => {
    vi.mocked(profileService.changeMyPassword).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.changePassword({
        currentPassword: 'OldPass1@',
        newPassword: 'NewPass1@',
      })
    })

    expect(profileService.changeMyPassword).toHaveBeenCalledWith({
      currentPassword: 'OldPass1@',
      newPassword: 'NewPass1@',
    })
  })

  it('should set isSuccess true when password change succeeds', async () => {
    vi.mocked(profileService.changeMyPassword).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.changePassword({
        currentPassword: 'OldPass1@',
        newPassword: 'NewPass1@',
      })
    })

    expect(result.current.isSuccess).toBe(true)
  })

  it('should set errorMessage when password change fails', async () => {
    vi.mocked(profileService.changeMyPassword).mockRejectedValueOnce({
      response: { data: { message: 'Current password is incorrect' } },
    })

    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.changePassword({
        currentPassword: 'WrongPass1@',
        newPassword: 'NewPass1@',
      })
    })

    expect(result.current.errorMessage).toBe('Current password is incorrect')
  })

  it('should not send confirmPassword to the backend', async () => {
    vi.mocked(profileService.changeMyPassword).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useChangePassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.changePassword({
        currentPassword: 'OldPass1@',
        newPassword: 'NewPass1@',
      })
    })

    // Confirm only currentPassword and newPassword are sent
    expect(profileService.changeMyPassword).toHaveBeenCalledWith({
      currentPassword: 'OldPass1@',
      newPassword: 'NewPass1@',
    })
    expect(profileService.changeMyPassword).not.toHaveBeenCalledWith(
      expect.objectContaining({ confirmPassword: expect.anything() })
    )
  })
})