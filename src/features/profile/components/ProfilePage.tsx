import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useChangePassword } from '../hooks/useChangePassword'
import { useTwoFactorSetup } from '../hooks/useTwoFactorSetup'
import { useAuthStore } from '../../../store/authStore'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'
import { formatDateTime } from '../../../shared/utils/formatCurrency'
import { QRCodeSVG } from 'qrcode.react'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the profile page UI and delegates all logic
 * to the four profile hooks. No API calls, no business logic here.
 */
type NullableString = string | null
const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const { profile, isLoading, isError } = useProfile()
  const {
    updateProfile,
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    errorMessage: updateError,
  } = useUpdateProfile()
  const {
    changePassword,
    isLoading: passwordLoading,
    isSuccess: passwordSuccess,
    errorMessage: passwordError,
  } = useChangePassword()
  const {
    initiate,
    verify,
    disable,
    isLoading: twoFaLoading,
    isVerified,
    isDisabled,
    errorMessage: twoFaError,
    setupData,
  } = useTwoFactorSetup()

  // Profile form state — pre-filled from fetched profile
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordValidationError, setPasswordValidationError] =
  useState<NullableString>(null)

  // 2FA verify form state
  const [totpCode, setTotpCode] = useState('')

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName)
      setPhoneNumber(profile.phoneNumber)
      setAddress(profile.address)
    }
  }, [profile])

  // Redirect to login after successful password change
  // Backend has invalidated the refresh token — user must re-login
  useEffect(() => {
    if (passwordSuccess) {
      clearAuth()
      navigate('/login', { replace: true })
    }
  }, [passwordSuccess, clearAuth, navigate])

  const handleUpdateProfile = async () => {
    await updateProfile({ fullName, phoneNumber, address })
  }

  const handleChangePassword = async () => {
    setPasswordValidationError(null)

    if (newPassword !== confirmPassword) {
      setPasswordValidationError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setPasswordValidationError(
        'New password must be at least 8 characters'
      )
      return
    }

    await changePassword({ currentPassword, newPassword })
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-app">

      {/* Top navigation bar */}
      <header className="bg-navy shadow-elevated">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center
                        justify-between">
          <h1 className="font-display text-xl font-semibold text-surface">
            HDFC NetBanking
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-300 hover:text-gold
                         transition-colors duration-150"
            >
              Dashboard
            </button>
            <span className="text-sm text-gray-300">
              Welcome, {user?.username}
            </span>
            <Button
              label="Sign Out"
              onClick={handleLogout}
              variant="secondary"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">

          <h2 className="font-display text-2xl font-semibold text-navy mb-8">
            Profile & Settings
          </h2>

          {/* Loading state */}
          {isLoading && (
            <p className="text-sm text-text-muted">Loading profile...</p>
          )}

          {/* Error state */}
          {isError && (
            <div
              role="alert"
              className="px-4 py-3 rounded-input bg-red-50 border
                         border-error text-error text-sm"
            >
              Could not load profile. Please try again later.
            </div>
          )}

          {profile && (
            <div className="flex flex-col gap-6">

              {/* Profile information section */}
              <div className="bg-surface rounded-xl shadow-card px-8 py-8">
                <h3 className="font-display text-lg font-semibold text-navy
                               mb-6">
                  Personal Information
                </h3>

                {/* Read-only email */}
                <div className="mb-5">
                  <p className="text-xs text-text-muted uppercase tracking-wider
                                mb-1">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-navy">
                    {profile.email}
                  </p>
                </div>

                {/* KYC status */}
                <div className="mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider
                                mb-1">
                    KYC Status
                  </p>
                  <span
                    className={`text-sm font-medium
                      ${profile.isKycVerified
                        ? 'text-success'
                        : 'text-error'
                      }`}
                  >
                    {profile.isKycVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                {/* Member since */}
                <div className="mb-6">
                  <p className="text-xs text-text-muted uppercase tracking-wider
                                mb-1">
                    Member Since
                  </p>
                  <p className="text-sm text-navy">
                    {formatDateTime(profile.createdAt)}
                  </p>
                </div>

                {/* Editable fields */}
                <div className="flex flex-col gap-5">
                  {updateError && (
                    <div
                      role="alert"
                      className="px-4 py-3 rounded-input bg-red-50 border
                                 border-error text-error text-sm"
                    >
                      {updateError}
                    </div>
                  )}

                  {updateSuccess && (
                    <div className="px-4 py-3 rounded-input bg-green-50
                                    border border-success text-success text-sm">
                      Profile updated successfully.
                    </div>
                  )}

                  <InputField
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={updateLoading}
                    autoComplete="name"
                  />

                  <InputField
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={updateLoading}
                    autoComplete="tel"
                  />

                  <InputField
                    id="address"
                    label="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={updateLoading}
                    autoComplete="street-address"
                  />

                  <Button
                    label="Save Changes"
                    onClick={handleUpdateProfile}
                    isLoading={updateLoading}
                    loadingLabel="Saving..."
                    fullWidth
                  />
                </div>
              </div>

              {/* Two-Factor Authentication section */}
              <div className="bg-surface rounded-xl shadow-card px-8 py-8">
                <h3 className="font-display text-lg font-semibold text-navy
                               mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  {profile.isTwoFactorEnabled
                    ? 'Two-factor authentication is currently enabled on your account.'
                    : 'Add an extra layer of security by enabling two-factor authentication.'}
                </p>

                {twoFaError && (
                  <div
                    role="alert"
                    className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                               border-error text-error text-sm"
                  >
                    {twoFaError}
                  </div>
                )}

                {/* 2FA disabled — show enable button */}
                {!profile.isTwoFactorEnabled && !setupData && !isVerified && (
                  <Button
                    label="Enable 2FA"
                    onClick={initiate}
                    isLoading={twoFaLoading}
                    loadingLabel="Setting up..."
                    variant="secondary"
                  />
                )}

                {/* 2FA setup initiated — show QR code and verify form */}
                {setupData && !isVerified && (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-text-secondary">
                      Scan this QR code with your authenticator app, then
                      enter the 6-digit code below to complete setup.
                    </p>
                    <div className="flex justify-center p-4 bg-app
                                    rounded-xl border border-gray-100">
                      <QRCodeSVG value={setupData.qrCodeUri} size={160} />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Manual entry key:{' '}
                      <span className="font-mono font-medium text-navy">
                        {setupData.secret}
                      </span>
                    </p>
                    <InputField
                      id="totpCode"
                      label="Authentication Code"
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="000000"
                      disabled={twoFaLoading}
                      autoComplete="one-time-code"
                    />
                    <Button
                      label="Verify & Enable"
                      onClick={() => verify(totpCode)}
                      isLoading={twoFaLoading}
                      loadingLabel="Verifying..."
                      fullWidth
                    />
                  </div>
                )}

                {/* 2FA just verified — show success */}
                {isVerified && (
                  <div className="px-4 py-3 rounded-input bg-green-50
                                  border border-success text-success text-sm">
                    Two-factor authentication has been enabled successfully.
                  </div>
                )}

                {/* 2FA enabled — show disable button */}
                {profile.isTwoFactorEnabled && !isDisabled && (
                  <Button
                    label="Disable 2FA"
                    onClick={disable}
                    isLoading={twoFaLoading}
                    loadingLabel="Disabling..."
                    variant="secondary"
                  />
                )}

                {/* 2FA just disabled — show success */}
                {isDisabled && (
                  <div className="px-4 py-3 rounded-input bg-green-50
                                  border border-success text-success text-sm">
                    Two-factor authentication has been disabled.
                  </div>
                )}
              </div>

              {/* Change Password section */}
              <div className="bg-surface rounded-xl shadow-card px-8 py-8">
                <h3 className="font-display text-lg font-semibold text-navy
                               mb-2">
                  Change Password
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  After changing your password you will be signed out and
                  must log in again.
                </p>

                {passwordError && (
                  <div
                    role="alert"
                    className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                               border-error text-error text-sm"
                  >
                    {passwordError}
                  </div>
                )}

                {passwordValidationError && (
                  <div
                    role="alert"
                    className="mb-4 px-4 py-3 rounded-input bg-red-50 border
                               border-error text-error text-sm"
                  >
                    {passwordValidationError}
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <InputField
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordLoading}
                    autoComplete="current-password"
                  />

                  <InputField
                    id="newPassword"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordLoading}
                    autoComplete="new-password"
                  />

                  <InputField
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordLoading}
                    autoComplete="new-password"
                  />

                  <Button
                    label="Change Password"
                    onClick={handleChangePassword}
                    isLoading={passwordLoading}
                    loadingLabel="Changing..."
                    fullWidth
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfilePage