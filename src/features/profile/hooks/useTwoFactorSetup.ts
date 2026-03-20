import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  initiateTwoFactorSetup,
  verifyTwoFactorSetup,
  disableTwoFactor,
} from '../services/profileService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { MY_PROFILE_QUERY_KEY } from './useProfile'
import type { TwoFactorSetupResponse } from '../types/profile.types'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the full 2FA lifecycle — initiate setup, verify code,
 * and disable. On any mutation success it invalidates the profile cache
 * so isTwoFactorEnabled reflects the latest state without a page reload.
 */
export const useTwoFactorSetup = () => {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [setupData, setSetupData] =
    useState<TwoFactorSetupResponse | null>(null)

  const initiate = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = await initiateTwoFactorSetup()
      setSetupData(data)
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, '2FA setup failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const verify = async (code: string) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await verifyTwoFactorSetup({ code })
      setIsVerified(true)

      // Invalidate profile so isTwoFactorEnabled updates to true
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY })
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(
          error,
          'Verification failed. Please check the code and try again.'
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const disable = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await disableTwoFactor()
      setIsDisabled(true)
      setSetupData(null)

      // Invalidate profile so isTwoFactorEnabled updates to false
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY })
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, '2FA disable failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    initiate,
    verify,
    disable,
    isLoading,
    isVerified,
    isDisabled,
    errorMessage,
    setupData,
  }
}