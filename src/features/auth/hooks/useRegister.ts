import { useState } from 'react'
import { registerUser } from '../services/authService'
import type { RegisterRequest } from '../types/auth.types'
import { extractErrorMessage } from '../../../shared/utils/extractErrorMessage'


/*
 * Pattern: Custom Hook (SRP — Single Responsibility Principle)
 * This hook owns the registration flow and nothing else.
 * The component that uses this hook only deals with UI — never with API logic.
 */
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    setErrorMessage(null)
    setIsSuccess(false)

    try {
      await registerUser(data)
      setIsSuccess(true)
    } catch (error: unknown) {
      setErrorMessage(extractErrorMessage(error, 'Login failed. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading,
    isSuccess,
    errorMessage,
  }
}