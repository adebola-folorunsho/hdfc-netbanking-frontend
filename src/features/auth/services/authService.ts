import apiClient from '../../../shared/utils/apiClient'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TwoFactorValidateRequest,
  AuthSuccessResponse,
} from '../types/auth.types'

/*
 * Pattern: Service Layer (SRP — Single Responsibility Principle)
 * This file owns all auth-related API calls and nothing else.
 * Components and hooks never call apiClient directly — they go through this service.
 * This keeps API knowledge in one place — if an endpoint changes, only this file changes.
 */

// Represents the backend's standard ApiResponse<T> wrapper shape.
// Every endpoint returns { status, message, data: T } — we unwrap to T before returning.
interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

// POST /api/v1/users/register
export const registerUser = async (
  data: RegisterRequest
): Promise<void> => {
  await apiClient.post('/api/v1/users/register', data)
}

// POST /api/v1/auth/login
// Returns either a 2FA required response or full auth tokens
export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    data
  )
  return response.data.data
}

// POST /api/v1/2fa/validate
// Exchanges the temp token + TOTP code for full auth tokens
export const validateTwoFactor = async (
  data: TwoFactorValidateRequest
): Promise<AuthSuccessResponse> => {
  const response = await apiClient.post<ApiResponse<AuthSuccessResponse>>(
    '/api/v1/2fa/validate',
    data
  )
  return response.data.data
}

// POST /api/v1/auth/refresh
// Sends the refresh token cookie and returns a new access token
export const refreshAccessToken = async (): Promise<AuthSuccessResponse> => {
  const response = await apiClient.post<ApiResponse<AuthSuccessResponse>>(
    '/api/v1/auth/refresh',
    {},
    {
      // Send cookies with this request so the httpOnly refresh token cookie
      // is included automatically by the browser
      withCredentials: true,
    }
  )
  return response.data.data
}