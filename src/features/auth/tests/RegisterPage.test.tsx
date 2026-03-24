import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../components/RegisterPage'
import * as useRegisterHook from '../hooks/useRegister'

vi.mock('../hooks/useRegister')

const mockUseRegister = (overrides = {}) => {
  vi.mocked(useRegisterHook.useRegister).mockReturnValue({
    register: vi.fn(),
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    ...overrides,
  })
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRegister()
  })

  it('should render all registration form fields', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Government ID')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument()
  })

  it('should show validation error when form is submitted empty', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Create Account' }))
    expect(screen.getByText('First name is required')).toBeInTheDocument()
  })

  it('should call register with correct values when form is submitted', async () => {
    const mockRegister = vi.fn()
    mockUseRegister({ register: mockRegister })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Phone Number'), '08012345678')
    await user.type(screen.getByLabelText('Address'), '123 Main Street, Lagos')
    await user.type(screen.getByLabelText('Government ID'), 'A12345678')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(mockRegister).toHaveBeenCalledWith({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '08012345678',
      address: '123 Main Street, Lagos',
      governmentId: 'A12345678',
    })
  })

  it('should display error message from hook when registration fails', () => {
    mockUseRegister({ errorMessage: 'Email already exists' })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Email already exists')).toBeInTheDocument()
  })

  it('should show success message when registration succeeds', () => {
    mockUseRegister({ isSuccess: true })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/account created successfully/i)
    ).toBeInTheDocument()
  })

  it('should render a link to the login page', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /sign in/i })
    ).toBeInTheDocument()
  })
})