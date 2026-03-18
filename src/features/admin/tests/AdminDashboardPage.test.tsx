import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminDashboardPage from '../components/AdminDashboardPage'

const renderPage = () => {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminDashboardPage', () => {
  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: /admin overview/i })
    ).toBeInTheDocument()
  })

  it('should render the audit logs navigation card', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Audit Logs' })
    ).toBeInTheDocument()
  })

  it('should render the statements navigation card', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Statements' })
    ).toBeInTheDocument()
  })

  it('should render a link to the audit logs page', () => {
    renderPage()
    expect(
      screen.getByRole('link', { name: /view audit logs/i })
    ).toBeInTheDocument()
  })

  it('should render a link to the statements page', () => {
    renderPage()
    expect(
      screen.getByRole('link', { name: /view statements/i })
    ).toBeInTheDocument()
  })
})