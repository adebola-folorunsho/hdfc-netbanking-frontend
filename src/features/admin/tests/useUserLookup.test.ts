import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useUserLookup } from '../hooks/useUserLookup'
import * as adminUserService from '../services/adminUserService'

vi.mock('../services/adminUserService', () => ({
  fetchUserById: vi.fn(),
  verifyUserKyc: vi.fn(),
  assignUserRole: vi.fn(),
  revokeUserRole: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockUser = {
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

describe('useUserLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch when userId is 0', () => {
    const { result } = renderHook(() => useUserLookup(0), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
    expect(adminUserService.fetchUserById).not.toHaveBeenCalled()
  })

  it('should fetch user when userId is provided', async () => {
    vi.mocked(adminUserService.fetchUserById).mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useUserLookup(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.user).toEqual(mockUser)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminUserService.fetchUserById).mockRejectedValueOnce(
      new Error('User not found')
    )

    const { result } = renderHook(() => useUserLookup(99), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should call verifyUserKyc when verifyKyc is called', async () => {
    vi.mocked(adminUserService.fetchUserById).mockResolvedValueOnce(mockUser)
    vi.mocked(adminUserService.verifyUserKyc).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useUserLookup(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await act(async () => {
      await result.current.verifyKyc()
    })

    expect(adminUserService.verifyUserKyc).toHaveBeenCalledWith(1)
  })

  it('should call assignRole with correct data', async () => {
    vi.mocked(adminUserService.fetchUserById).mockResolvedValueOnce(mockUser)
    vi.mocked(adminUserService.assignUserRole).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useUserLookup(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await act(async () => {
      await result.current.assignRole('TELLER')
    })

    expect(adminUserService.assignUserRole).toHaveBeenCalledWith(1, {
      role: 'TELLER',
    })
  })

  it('should call revokeRole with correct data', async () => {
    vi.mocked(adminUserService.fetchUserById).mockResolvedValueOnce(mockUser)
    vi.mocked(adminUserService.revokeUserRole).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useUserLookup(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await act(async () => {
      await result.current.revokeRole('CUSTOMER')
    })

    expect(adminUserService.revokeUserRole).toHaveBeenCalledWith(1, {
      role: 'CUSTOMER',
    })
  })
})