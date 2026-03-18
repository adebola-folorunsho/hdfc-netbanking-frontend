import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import StatementsPage from '../components/StatementsPage'
import * as useStatementsByUserHook from '../hooks/useStatementsByUser'

vi.mock('../hooks/useStatementsByUser')

const mockStatements = [
  {
    id: 1,
    userId: 123,
    accountId: 456,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    generatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 123,
    accountId: 789,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    generatedAt: '2026-03-01T00:00:00Z',
  },
]

const mockUseStatementsByUser = (overrides = {}) => {
  vi.mocked(useStatementsByUserHook.useStatementsByUser).mockReturnValue({
    statements: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    isLoading: false,
    isError: false,
    ...overrides,
  })
}

const renderPage = () => {
  return render(
    <MemoryRouter initialEntries={['/admin/statements']}>
      <Routes>
        <Route path="/admin/statements" element={<StatementsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('StatementsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStatementsByUser()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: /statements/i })
    ).toBeInTheDocument()
  })

  it('should render a user ID input field', () => {
    renderPage()
    expect(screen.getByLabelText(/user id/i)).toBeInTheDocument()
  })

  it('should render a search button', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: /search/i })
    ).toBeInTheDocument()
  })

  it('should show empty prompt before search is performed', () => {
    renderPage()
    expect(
      screen.getByText(/enter a user id to search/i)
    ).toBeInTheDocument()
  })

  it('should show loading state while fetching', async () => {
    const user = userEvent.setup()
    mockUseStatementsByUser({ isLoading: true })
    renderPage()
    await user.type(screen.getByLabelText(/user id/i), '123')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when fetch fails', async () => {
    const user = userEvent.setup()
    mockUseStatementsByUser({ isError: true })
    renderPage()
    await user.type(screen.getByLabelText(/user id/i), '123')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should show empty state when no statements found', async () => {
    const user = userEvent.setup()
    mockUseStatementsByUser({ statements: [], totalElements: 0 })
    renderPage()
    await user.type(screen.getByLabelText(/user id/i), '123')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByText(/no statements found/i)).toBeInTheDocument()
  })

  it('should render statement rows after successful search', async () => {
    const user = userEvent.setup()
    mockUseStatementsByUser({
      statements: mockStatements,
      totalElements: 2,
      totalPages: 1,
    })
    renderPage()
    await user.type(screen.getByLabelText(/user id/i), '123')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByText('456')).toBeInTheDocument()
    expect(screen.getByText('789')).toBeInTheDocument()
  })

  it('should render pagination controls when there are multiple pages', async () => {
    const user = userEvent.setup()
    mockUseStatementsByUser({
      statements: mockStatements,
      totalElements: 25,
      totalPages: 3,
    })
    renderPage()
    await user.type(screen.getByLabelText(/user id/i), '123')
    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /next/i })
    ).toBeInTheDocument()
  })
})