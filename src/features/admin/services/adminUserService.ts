import apiClient from '../../../shared/utils/apiClient'
import type { UserProfile } from '../types/admin.types'
import type { ApiResponse } from '../../dashboard/types/dashboard.types'
import type { RoleAssignmentRequest } from '../types/admin.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all admin user-related API calls and nothing else.
 * These endpoints go through the API Gateway (port 8080) with
 * @PreAuthorize role enforcement — not the Admin Gateway.
 */

/**
 * Fetches a user profile by user ID.
 * GET /api/v1/users/{userId}
 * Roles: ADMIN, TELLER
 */
export const fetchUserById = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>(
    `/api/v1/users/${userId}`
  )

  if (!response.data.data) {
    throw new Error(`User ${userId} not found`)
  }

  return response.data.data
}

/**
 * Marks a user as KYC verified.
 * PUT /api/v1/users/{userId}/kyc
 * Roles: ADMIN only
 * Body-less PUT — path variable only.
 */
export const verifyUserKyc = async (userId: number): Promise<void> => {
  await apiClient.put(`/api/v1/users/${userId}/kyc`)
}

/**
 * Assigns a role to a user.
 * POST /api/v1/roles/{targetUserId}/assign
 * Roles: ADMIN only
 */
export const assignUserRole = async (
  targetUserId: number,
  data: RoleAssignmentRequest
): Promise<void> => {
  await apiClient.post(`/api/v1/roles/${targetUserId}/assign`, data)
}

/**
 * Revokes a role from a user.
 * DELETE /api/v1/roles/{targetUserId}/revoke
 * Roles: ADMIN only
 */
export const revokeUserRole = async (
  targetUserId: number,
  data: RoleAssignmentRequest
): Promise<void> => {
  await apiClient.delete(`/api/v1/roles/${targetUserId}/revoke`, { data })
}