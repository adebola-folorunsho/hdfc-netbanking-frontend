import { useQuery } from '@tanstack/react-query'
import { fetchMyProfile } from '../services/profileService'
import type { UserProfile } from '../types/profile.types'

export const MY_PROFILE_QUERY_KEY = ['my-profile'] as const

/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the profile fetching logic and nothing else.
 * TanStack Query handles caching, loading, and error states automatically.
 */
export const useProfile = () => {
  const { data, isLoading, isError, isSuccess } = useQuery<UserProfile>({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: fetchMyProfile,
  })

  return {
    profile: data ?? null,
    isLoading,
    isError,
    isSuccess,
  }
}