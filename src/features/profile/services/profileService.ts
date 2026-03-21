import apiClient from '../../../shared/utils/apiClient'
import type { ApiResponse } from '../../dashboard/types/dashboard.types'
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
} from '../types/profile.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all profile-related API calls and nothing else.
 * Components and hooks never call apiClient directly — they go through
 * this service. If an endpoint changes, only this file changes.
 */

/**
 * Fetches the logged-in user's own profile.
 * GET /api/v1/users/me
 * Identity resolved from Bearer token — no path parameter needed.
 */
export const fetchMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>(
    '/api/v1/users/me'
  )

  if (!response.data.data) {
    throw new Error('Profile data missing from response')
  }

  return response.data.data
}

/**
 * Updates the logged-in user's profile.
 * PUT /api/v1/users/me
 * Only fullName, phoneNumber, address are updatable.
 */
export const updateMyProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const response = await apiClient.put<ApiResponse<UserProfile>>(
    '/api/v1/users/me',
    data
  )

  if (!response.data.data) {
    throw new Error('Updated profile data missing from response')
  }

  return response.data.data
}

/**
 * Changes the logged-in user's password.
 * POST /api/v1/users/me/change-password
 * On success the backend invalidates the refresh token immediately.
 * The frontend must clear auth and redirect to login after this call.
 */
export const changeMyPassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  await apiClient.post('/api/v1/users/me/change-password', data)
}

/**
 * Initiates 2FA setup — generates a TOTP secret and QR code URI.
 * POST /api/v1/2fa/setup
 * The secret is valid for 10 minutes in Redis.
 * If setup is not completed within 10 minutes, call this again.
 */
export const initiateTwoFactorSetup = async (): Promise<TwoFactorSetupResponse> => {
  const response = await apiClient.post<ApiResponse<TwoFactorSetupResponse>>(
    '/api/v1/2fa/setup'
  )

  if (!response.data.data) {
    throw new Error('2FA setup data missing from response')
  }

  return response.data.data
}

/**
 * Completes 2FA setup by verifying the TOTP code.
 * POST /api/v1/2fa/verify
 * On success — secret written to MySQL, isTwoFactorEnabled set to true.
 */
export const verifyTwoFactorSetup = async (
  data: TwoFactorVerifyRequest
): Promise<void> => {
  await apiClient.post('/api/v1/2fa/verify', data)
}

/**
 * Disables 2FA for the logged-in user.
 * DELETE /api/v1/2fa/disable
 * On success — secret cleared from MySQL, isTwoFactorEnabled set to false.
 */
export const disableTwoFactor = async (): Promise<void> => {
  await apiClient.delete('/api/v1/2fa/disable')
}