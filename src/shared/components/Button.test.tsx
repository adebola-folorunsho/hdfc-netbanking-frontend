import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('should render with label text', () => {
    render(<Button label="Sign In" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button label="Sign In" onClick={handleClick} />)
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should be disabled and not call onClick when disabled prop is true', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button label="Sign In" onClick={handleClick} disabled />)
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should show loading text and be disabled when isLoading is true', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button
        label="Sign In"
        onClick={handleClick}
        isLoading
        loadingLabel="Signing in..."
      />
    )

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Signing in...' }))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as full width when fullWidth prop is true', () => {
    render(<Button label="Sign In" onClick={() => {}} fullWidth />)
    expect(screen.getByRole('button', { name: 'Sign In' })).toHaveClass('w-full')
  })
})