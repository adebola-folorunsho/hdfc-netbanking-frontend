import axios from 'axios'
import { useAuthStore } from '../../store/authStore'

/*
 * Pattern: Singleton — one shared Axios instance for all admin-gateway traffic.
 * Mirrors apiClient but targets the Admin Gateway on port 8090.
 * Kept separate from apiClient so customer and admin traffic
 * are never accidentally mixed. If the admin gateway URL changes,
 * only this file needs updating.
 */
const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL ?? 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
// Attaches the access token from memory to every outgoing admin request.
// The Admin Gateway validates this token and enforces ROLE_ADMIN — if the
// token is missing or the role is wrong, the gateway rejects the request
// before it ever reaches the downstream service.
adminApiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// RESPONSE INTERCEPTOR
// Mirrors the behaviour of apiClient — clears auth state on 401
// so the user is redirected to login on token expiry.
adminApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }
    useAuthStore.getState().clearAuth()
    return Promise.reject(error)
  }
)

export default adminApiClient