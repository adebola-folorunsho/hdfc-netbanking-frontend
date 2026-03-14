/*
 * Pattern: Utility function (SRP — Single Responsibility Principle)
 * Owns the single responsibility of extracting a human-readable error message
 * from an unknown Axios error shape.
 * 
 * DRY — centralises error extraction so hooks never duplicate this logic.
 * If the backend error shape changes, only this file changes.
 */
export const extractErrorMessage = (
  error: unknown,
  fallback: string = 'Something went wrong. Please try again.'
): string => {
  const err = error as {
    response?: { data?: { message?: string } }
  }
  return err.response?.data?.message ?? fallback
}