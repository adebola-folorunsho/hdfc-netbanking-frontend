import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TwoFactorPage from '../components/TwoFactorPage'
import * as useTwoFactorHook from '../hooks/useTwoFactor'

vi.mock('../hooks/useTwoFactor')

const mockUseTwoFactor = (overrides = {}) => {
  vi.mocked(useTwoFactorHook.useTwoFactor).mockReturnValue({
    validateOtp: vi.fn(),
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    ...overrides,
  })
}

// Helper — renders TwoFactorPage with a tempToken in router state
const renderWithState = (state = { tempToken: 'temp-token-123' }) => {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/2fa', state }]}
    >
      <Routes>
        <Route path="/2fa" element={<TwoFactorPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TwoFactorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTwoFactor()
  })

  it('should render the OTP input and submit button', () => {
    renderWithState()

    expect(screen.getByLabelText('Authentication Code')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Verify Code' })
    ).toBeInTheDocument()
  })

  it('should show validation error when submitted with empty OTP', async () => {
    const user = userEvent.setup()
    renderWithState()

    await user.click(screen.getByRole('button', { name: 'Verify Code' }))
    expect(screen.getByText('Authentication code is required')).toBeInTheDocument()
  })

  it('should call validateOtp with the entered code', async () => {
    const mockValidateOtp = vi.fn()
    mockUseTwoFactor({ validateOtp: mockValidateOtp })
    const user = userEvent.setup()
    renderWithState()

    await user.type(screen.getByLabelText('Authentication Code'), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify Code' }))

    expect(mockValidateOtp).toHaveBeenCalledWith('123456')
  })

  it('should display error message from hook when validation fails', () => {
    mockUseTwoFactor({ errorMessage: 'Invalid OTP code' })
    renderWithState()

    expect(screen.getByText('Invalid OTP code')).toBeInTheDocument()
  })

  it('should show loading state while validation is in progress', () => {
    mockUseTwoFactor({ isLoading: true })
    renderWithState()

    expect(
      screen.getByRole('button', { name: 'Verifying...' })
    ).toBeInTheDocument()
  })

  it('should redirect to login when no tempToken is in router state', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/2fa', state: null }]}>
        <Routes>
          <Route path="/2fa" element={<TwoFactorPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})