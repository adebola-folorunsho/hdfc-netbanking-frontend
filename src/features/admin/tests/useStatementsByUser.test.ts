import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useStatementsByUser } from '../hooks/useStatementsByUser'
import * as adminService from '../services/adminService'

vi.mock('../services/adminService', () => ({
  fetchStatementsByUser: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockPagedResponse = {
  content: [
    {
      id: 1,
      userId: 123,
      accountId: 456,
      periodStart: '2026-02-01',
      periodEnd: '2026-02-28',
      generatedAt: '2026-03-01T00:00:00Z',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
}

describe('useStatementsByUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return statements on successful fetch', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useStatementsByUser({ userId: 123, page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.statements).toEqual(mockPagedResponse.content)
  })

  it('should return correct pagination metadata', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useStatementsByUser({ userId: 123, page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.totalElements).toBe(1)
  })

  it('should return isLoading true while fetching', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockResolvedValueOnce(
      mockPagedResponse
    )

    const { result } = renderHook(
      () => useStatementsByUser({ userId: 123, page: 0 }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should return isError true when fetch fails', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(
      () => useStatementsByUser({ userId: 123, page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should return empty statements array when fetch fails', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(
      () => useStatementsByUser({ userId: 123, page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.statements).toEqual([])
  })

  it('should not fetch when userId is 0', async () => {
    const { result } = renderHook(
      () => useStatementsByUser({ userId: 0, page: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(adminService.fetchStatementsByUser).not.toHaveBeenCalled()
  })

  it('should call fetchStatementsByUser with correct arguments', async () => {
    vi.mocked(adminService.fetchStatementsByUser).mockResolvedValueOnce(
      mockPagedResponse
    )

    renderHook(
      () => useStatementsByUser({ userId: 123, page: 0, size: 5 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() =>
      expect(adminService.fetchStatementsByUser).toHaveBeenCalledWith(
        123,
        0,
        5
      )
    )
  })
})