import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { AuthUser } from '../features/auth/types/auth.types'

interface ProtectedRouteProps {
  // The component to render if the guard passes
  children: React.ReactNode
  // Optional — if provided, the user's role must match one of these
  allowedRoles?: AuthUser['role'][]
}

/*
 * Pattern: Guard (SRP — Single Responsibility Principle)
 * This component owns one responsibility — deciding whether to render
 * its children or redirect. No UI, no data fetching, no business logic.
 *
 * OCP — new role requirements are handled by passing a different
 * allowedRoles array. This component never needs to be modified.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  // Not logged in — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role check — if allowedRoles is provided, the user's role must be in the list
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute