import axios from 'axios'
import { useAuthStore } from '../../store/authStore'

/*
 * Pattern: Singleton — one shared Axios instance used across the entire app.
 * All API calls go through this instance so interceptors apply universally.
 * Creating a new axios instance per feature would bypass the interceptors.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
// Runs before every outgoing request
// Attaches the access token from memory to the Authorization header
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// RESPONSE INTERCEPTOR
// Runs after every incoming response
// Handles 401 Unauthorized — token expired or missing
// Silent refresh will be wired in here in the next step
apiClient.interceptors.response.use(
  // Success path — pass the response through untouched
  (response) => response,

  // Error path — inspect the error before rejecting
  async (error) => {
    // If the error is not a 401, reject immediately — nothing to do here
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // 401 handling — silent refresh will be added here
    // For now, clear auth and let the app redirect to login
    useAuthStore.getState().clearAuth()
    return Promise.reject(error)
  }
)

export default apiClient