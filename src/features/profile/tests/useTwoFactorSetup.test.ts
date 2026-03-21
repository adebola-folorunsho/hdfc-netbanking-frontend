import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTwoFactorSetup } from '../hooks/useTwoFactorSetup'
import * as profileService from '../services/profileService'

vi.mock('../services/profileService', () => ({
  initiateTwoFactorSetup: vi.fn(),
  verifyTwoFactorSetup: vi.fn(),
  disableTwoFactor: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockSetupResponse = {
  secret: 'JBSWY3DPEHPK3PXP',
  qrCodeUri:
    'otpauth://totp/HDFC%20NetBanking:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HDFC%20NetBanking',
}

describe('useTwoFactorSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialise with isLoading false', () => {
    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('should return setup data after initiate is called', async () => {
    vi.mocked(
      profileService.initiateTwoFactorSetup
    ).mockResolvedValueOnce(mockSetupResponse)

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.initiate()
    })

    expect(result.current.setupData).toEqual(mockSetupResponse)
  })

  it('should set errorMessage when initiate fails', async () => {
    vi.mocked(
      profileService.initiateTwoFactorSetup
    ).mockRejectedValueOnce({
      response: { data: { message: '2FA setup failed' } },
    })

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.initiate()
    })

    expect(result.current.errorMessage).toBe('2FA setup failed')
  })

  it('should call verifyTwoFactorSetup with correct code', async () => {
    vi.mocked(
      profileService.verifyTwoFactorSetup
    ).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.verify('123456')
    })

    expect(profileService.verifyTwoFactorSetup).toHaveBeenCalledWith({
      code: '123456',
    })
  })

  it('should set isVerified true after successful verification', async () => {
    vi.mocked(
      profileService.verifyTwoFactorSetup
    ).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.verify('123456')
    })

    expect(result.current.isVerified).toBe(true)
  })

  it('should call disableTwoFactor when disable is called', async () => {
    vi.mocked(profileService.disableTwoFactor).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.disable()
    })

    expect(profileService.disableTwoFactor).toHaveBeenCalledOnce()
  })

  it('should set isDisabled true after successful disable', async () => {
    vi.mocked(profileService.disableTwoFactor).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTwoFactorSetup(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.disable()
    })

    expect(result.current.isDisabled).toBe(true)
  })
})