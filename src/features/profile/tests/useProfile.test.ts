import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useProfile } from '../hooks/useProfile'
import * as profileService from '../services/profileService'

vi.mock('../services/profileService', () => ({
  fetchMyProfile: vi.fn(),
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
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '08012345678',
  address: '123 Main St',
  roles: ['CUSTOMER'],
  isEnabled: true,
  isKycVerified: false,
  isTwoFactorEnabled: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return profile on successful fetch', async () => {
    vi.mocked(profileService.fetchMyProfile).mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(profileService.fetchMyProfile).mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(profileService.fetchMyProfile).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return null profile when data is not yet loaded', async () => {
    vi.mocked(profileService.fetchMyProfile).mockResolvedValueOnce(mockProfile)

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    expect(result.current.profile).toBeNull()
  })
})