import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import ProfilePage from '../components/ProfilePage'
import * as useProfileHook from '../hooks/useProfile'
import * as useUpdateProfileHook from '../hooks/useUpdateProfile'
import * as useChangePasswordHook from '../hooks/useChangePassword'
import * as useTwoFactorSetupHook from '../hooks/useTwoFactorSetup'

vi.mock('../hooks/useProfile')
vi.mock('../hooks/useUpdateProfile')
vi.mock('../hooks/useChangePassword')
vi.mock('../hooks/useTwoFactorSetup')

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

const mockUseProfile = (overrides = {}) => {
  vi.mocked(useProfileHook.useProfile).mockReturnValue({
    profile: mockProfile,
    isLoading: false,
    isError: false,
    isSuccess: true,
    ...overrides,
  })
}

const mockUseUpdateProfile = (overrides = {}) => {
  vi.mocked(useUpdateProfileHook.useUpdateProfile).mockReturnValue({
    updateProfile: vi.fn(),
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    ...overrides,
  })
}

const mockUseChangePassword = (overrides = {}) => {
  vi.mocked(useChangePasswordHook.useChangePassword).mockReturnValue({
    changePassword: vi.fn(),
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    ...overrides,
  })
}

const mockUseTwoFactorSetup = (overrides = {}) => {
  vi.mocked(useTwoFactorSetupHook.useTwoFactorSetup).mockReturnValue({
    initiate: vi.fn(),
    verify: vi.fn(),
    disable: vi.fn(),
    isLoading: false,
    isVerified: false,
    isDisabled: false,
    errorMessage: null,
    setupData: null,
    ...overrides,
  })
}

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(ProfilePage))
    )
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProfile()
    mockUseUpdateProfile()
    mockUseChangePassword()
    mockUseTwoFactorSetup()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Profile & Settings' })
    ).toBeInTheDocument()
  })

  it('should render the user email as read-only', () => {
    renderPage()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should render the full name input pre-filled', () => {
    renderPage()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('should render the KYC status', () => {
    renderPage()
    expect(screen.getByText('Not Verified')).toBeInTheDocument()
  })

  it('should render the 2FA section', () => {
    renderPage()
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
  })

  it('should render enable 2FA button when 2FA is disabled', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: 'Enable 2FA' })
    ).toBeInTheDocument()
  })

  it('should render disable 2FA button when 2FA is enabled', () => {
    mockUseProfile({ profile: { ...mockProfile, isTwoFactorEnabled: true } })
    renderPage()
    expect(
      screen.getByRole('button', { name: 'Disable 2FA' })
    ).toBeInTheDocument()
  })

  it('should render the change password section', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Change Password' })
    ).toBeInTheDocument()
  })

  it('should show loading state while profile is fetching', () => {
    mockUseProfile({ isLoading: true, isSuccess: false, profile: null })
    renderPage()
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument()
  })

  it('should call updateProfile when save button is clicked', async () => {
    const mockUpdateProfile = vi.fn()
    mockUseUpdateProfile({ updateProfile: mockUpdateProfile })
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))
    expect(mockUpdateProfile).toHaveBeenCalled()
  })
})