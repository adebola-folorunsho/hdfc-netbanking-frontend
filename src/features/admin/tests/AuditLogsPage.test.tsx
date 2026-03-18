import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuditLogsPage from '../components/AuditLogsPage'
import * as useAuditLogsHook from '../hooks/useAuditLogs'
import * as useAuditLogsByTypeHook from '../hooks/useAuditLogsByType'

vi.mock('../hooks/useAuditLogs')
vi.mock('../hooks/useAuditLogsByType')

const mockAuditLogs = [
  {
    id: 1,
    eventType: 'TRANSACTION_CREATED',
    actor: 'user-123',
    description: 'Transfer of ₦5000 completed',
    createdAt: '2026-03-14T12:00:00Z',
  },
  {
    id: 2,
    eventType: 'FRAUD_ALERT',
    actor: 'user-456',
    description: 'Suspicious transaction detected',
    createdAt: '2026-03-14T13:00:00Z',
  },
]

const mockUseAuditLogs = (overrides = {}) => {
  vi.mocked(useAuditLogsHook.useAuditLogs).mockReturnValue({
    logs: mockAuditLogs,
    totalPages: 2,
    totalElements: 15,
    currentPage: 0,
    isLoading: false,
    isError: false,
    isFetching: false,
    ...overrides,
  })
}

const mockUseAuditLogsByType = (overrides = {}) => {
  vi.mocked(useAuditLogsByTypeHook.useAuditLogsByType).mockReturnValue({
    logs: [mockAuditLogs[1]],
    totalPages: 1,
    totalElements: 1,
    currentPage: 0,
    isLoading: false,
    isError: false,
    ...overrides,
  })
}

const renderPage = () => {
  return render(
    <MemoryRouter initialEntries={['/admin/audit-logs']}>
      <Routes>
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AuditLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuditLogs()
    mockUseAuditLogsByType()
  })

  it('should render the page heading', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: /audit logs/i })
    ).toBeInTheDocument()
  })

  it('should render the event type filter', () => {
    renderPage()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should render audit log rows', () => {
    renderPage()
    expect(screen.getByText('Transfer of ₦5000 completed')).toBeInTheDocument()
    expect(
      screen.getByText('Suspicious transaction detected')
    ).toBeInTheDocument()
  })

  it('should render event type badges', () => {
    renderPage()
    expect(screen.getByText('TRANSACTION_CREATED')).toBeInTheDocument()
    expect(screen.getByText('FRAUD_ALERT')).toBeInTheDocument()
  })

  it('should show loading state while fetching', () => {
    mockUseAuditLogs({ isLoading: true, logs: [], isFetching: true })
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should show error state when fetch fails', () => {
    mockUseAuditLogs({ isError: true, logs: [], isFetching: false })
    renderPage()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should show empty state when no logs exist', () => {
    mockUseAuditLogs({
      logs: [],
      totalElements: 0,
      isFetching: false,
    })
    renderPage()
    expect(screen.getByText(/no audit logs found/i)).toBeInTheDocument()
  })

  it('should render pagination controls when there are multiple pages', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /next/i })
    ).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('should change filter when event type is selected', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.selectOptions(screen.getByRole('combobox'), 'FRAUD_ALERT')
    expect(screen.getByRole('combobox')).toHaveValue('FRAUD_ALERT')
  })
})