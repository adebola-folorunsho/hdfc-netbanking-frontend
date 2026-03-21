import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import UserLookupPage from '../components/UserLookupPage'
import * as useUserLookupHook from '../hooks/useUserLookup'

vi.mock('../hooks/useUserLookup')

const mockUseUserLookup = (overrides = {}) => {
  vi.mocked(useUserLookupHook.useUserLookup).mockReturnValue({
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isMutating: false,
    mutationError: null,
    verifyKyc: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
    ...overrides,
  })
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

const renderPage = () => {
  const queryClient = new QueryClient()
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(UserLookupPage))
    )
  )
}

describe('UserLookupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUserLookup()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'User Lookup' })
    ).toBeInTheDocument()
  })

  it('should render user ID input and search button', () => {
    renderPage()
    expect(screen.getByLabelText('User ID')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Search' })
    ).toBeInTheDocument()
  })

  it('should show validation error when user ID is empty', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByText('Please enter a valid user ID')).toBeInTheDocument()
  })

  it('should show user profile when user is found', () => {
    mockUseUserLookup({ user: mockUser, isSuccess: true })
    renderPage()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should show KYC status', () => {
    mockUseUserLookup({ user: mockUser, isSuccess: true })
    renderPage()

    expect(screen.getByText('Not Verified')).toBeInTheDocument()
  })

  it('should show error state when user not found', () => {
    mockUseUserLookup({ isError: true })
    renderPage()

    expect(
      screen.getByText(/user not found/i)
    ).toBeInTheDocument()
  })

  it('should show loading state while fetching', () => {
    mockUseUserLookup({ isLoading: true })
    renderPage()

    expect(screen.getByText('Searching for user...')).toBeInTheDocument()
  })
})