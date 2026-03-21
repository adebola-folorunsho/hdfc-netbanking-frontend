/**
 * User profile — matches the response from GET /api/v1/users/me
 * and PUT /api/v1/users/me.
 * roles values are CUSTOMER, TELLER, ADMIN — no ROLE_ prefix.
 */
export interface UserProfile {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
  roles: string[]
  isEnabled: boolean
  isKycVerified: boolean
  isTwoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Request body for PUT /api/v1/users/me
 * Only these three fields are updatable by the user.
 * email, roles, KYC status are read-only.
 */
export interface UpdateProfileRequest {
  fullName: string
  phoneNumber: string
  address: string
}

/**
 * Request body for POST /api/v1/users/me/change-password
 * confirmPassword is frontend-only — never sent to backend.
 * On success the backend invalidates the refresh token —
 * the user must log in again.
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Response from POST /api/v1/2fa/setup
 * qrCodeUri is displayed as a scannable QR code.
 * secret is shown as a fallback for manual entry.
 * Both are valid for 10 minutes only.
 */
export interface TwoFactorSetupResponse {
  secret: string
  qrCodeUri: string
}

/**
 * Request body for POST /api/v1/2fa/verify
 * Completes the 2FA setup flow after scanning the QR code.
 */
export interface TwoFactorVerifyRequest {
  code: string
}