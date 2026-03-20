import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import * as profileService from '../services/profileService'

vi.mock('../services/profileService', () => ({
  updateMyProfile: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockProfile = {
  id: 1,
  fullName: 'John Doe Updated',
  email: 'john@example.com',
  phoneNumber: '08099999999',
  address: '456 New Street',
  roles: ['CUSTOMER'],
  isEnabled: true,
  isKycVerified: false,
  isTwoFactorEnabled: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-03-14T00:00:00Z',
}

describe('useUpdateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('should call updateMyProfile with correct data', async () => {
    vi.mocked(profileService.updateMyProfile).mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.updateProfile({
        fullName: 'John Doe Updated',
        phoneNumber: '08099999999',
        address: '456 New Street',
      })
    })

    expect(profileService.updateMyProfile).toHaveBeenCalledWith({
      fullName: 'John Doe Updated',
      phoneNumber: '08099999999',
      address: '456 New Street',
    })
  })

  it('should set isSuccess true when update succeeds', async () => {
    vi.mocked(profileService.updateMyProfile).mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.updateProfile({
        fullName: 'John Doe Updated',
        phoneNumber: '08099999999',
        address: '456 New Street',
      })
    })

    expect(result.current.isSuccess).toBe(true)
  })

  it('should set errorMessage when update fails', async () => {
    vi.mocked(profileService.updateMyProfile).mockRejectedValueOnce({
      response: { data: { message: 'Invalid phone number' } },
    })

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.updateProfile({
        fullName: 'John Doe',
        phoneNumber: 'invalid',
        address: '123 Main St',
      })
    })

    expect(result.current.errorMessage).toBe('Invalid phone number')
  })
})