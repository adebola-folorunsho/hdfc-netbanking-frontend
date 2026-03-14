import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../components/LoginPage'
import * as useLoginHook from '../hooks/useLogin'

// Mock the entire useLogin hook so LoginPage tests never trigger real API calls
vi.mock('../hooks/useLogin')

const mockUseLogin = (overrides = {}) => {
  vi.mocked(useLoginHook.useLogin).mockReturnValue({
    login: vi.fn(),
    isLoading: false,
    errorMessage: null,
    requires2FA: false,
    tempToken: null,
    ...overrides,
  })
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLogin()
  })

  it('should render the login form with email and password fields', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Username or Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('should show validation error when form is submitted empty', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(screen.getByText('Username or email is required')).toBeInTheDocument()
  })

  it('should call login with correct values when form is submitted', async () => {
    const mockLogin = vi.fn()
    mockUseLogin({ login: mockLogin })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Username or Email'), 'testuser')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(mockLogin).toHaveBeenCalledWith({
      usernameOrEmail: 'testuser',
      password: 'password123',
    })
  })

  it('should display error message from hook when login fails', () => {
    mockUseLogin({ errorMessage: 'Invalid credentials' })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('should show loading state while login is in progress', () => {
    mockUseLogin({ isLoading: true })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: 'Signing in...' })
    ).toBeInTheDocument()
  })

  it('should render a link to the register page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /create an account/i })
    ).toBeInTheDocument()
  })
})