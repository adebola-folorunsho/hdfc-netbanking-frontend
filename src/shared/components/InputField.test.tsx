import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import InputField from './InputField'

describe('InputField', () => {
  it('should render a label and input', () => {
    render(
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value=""
        onChange={() => {}}
      />
    )

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value=""
        onChange={handleChange}
      />
    )

    await user.type(screen.getByLabelText('Email Address'), 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('should display an error message when error prop is provided', () => {
    render(
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />
    )

    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value=""
        onChange={() => {}}
        disabled
      />
    )

    expect(screen.getByLabelText('Email Address')).toBeDisabled()
  })
})