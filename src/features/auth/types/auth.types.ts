// Represents the body sent to POST /api/v1/auth/login
export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

// Represents the body sent to POST /api/v1/auth/register
export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  phoneNumber: string
}

// Returned by the backend when 2FA is enabled on the account
// The full tokens are NOT issued yet — only a temporary token
export interface TwoFactorRequiredResponse {
  requires2FA: true
  tempToken: string
}

// Returned by the backend when login is successful and no 2FA is required
// Also returned after successful 2FA validation
export interface AuthSuccessResponse {
  requires2FA: false
  accessToken: string
  refreshToken: string
  role: 'ROLE_CUSTOMER' | 'ROLE_TELLER' | 'ROLE_ADMIN'
  userId: string
  username: string
}

// Union type — login can return either of these two shapes
export type LoginResponse = TwoFactorRequiredResponse | AuthSuccessResponse

// Represents the body sent to POST /api/v1/2fa/validate
export interface TwoFactorValidateRequest {
  tempToken: string
  totpCode: string
}

// Represents the body sent to POST /api/v1/auth/refresh
export interface RefreshTokenRequest {
  refreshToken: string
}

// The shape of the authenticated user stored in the auth store
export interface AuthUser {
  userId: string
  username: string
  role: 'ROLE_CUSTOMER' | 'ROLE_TELLER' | 'ROLE_ADMIN'
}