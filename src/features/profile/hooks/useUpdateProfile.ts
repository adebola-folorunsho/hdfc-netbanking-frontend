import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { updateMyProfile } from '../services/profileService'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'
import { MY_PROFILE_QUERY_KEY } from './useProfile'
import type { UpdateProfileRequest } from '../types/profile.types'

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the profile update flow and nothing else.
 * On success it invalidates the profile cache so the UI reflects
 * the latest data without a page reload.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateProfile = async (data: UpdateProfileRequest) => {
    setIsLoading(true)
    setIsSuccess(false)
    setErrorMessage(null)

    try {
      await updateMyProfile(data)
      setIsSuccess(true)

      // Invalidate profile cache so the UI reflects the updated data
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY })
    } catch (error: unknown) {
      setErrorMessage(
        extractErrorMessage(error, 'Profile update failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateProfile,
    isLoading,
    isSuccess,
    errorMessage,
  }
}