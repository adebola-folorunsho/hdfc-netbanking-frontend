import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const renderLayout = (initialPath = '/admin') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <div>Page content</div>
            </AdminLayout>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminLayout', () => {
  it('should render the HDFC NetBanking brand name', () => {
    renderLayout()
    expect(screen.getByText('HDFC NetBanking')).toBeInTheDocument()
  })

  it('should render the Admin Panel label', () => {
    renderLayout()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    renderLayout()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /audit logs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /statements/i })).toBeInTheDocument()
  })

  it('should render children', () => {
    renderLayout()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('should render a sign out button', () => {
    renderLayout()
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
  })

  it('should call clearAuth and navigate to login on sign out', async () => {
    const user = userEvent.setup()
    renderLayout()
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(screen.queryByText('Page content')).not.toBeInTheDocument()
  })
})