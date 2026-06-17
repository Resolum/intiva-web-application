import { useAuthStore } from '@/iam/application/auth.store.js'

/**
 * Presentation service for authentication use cases.
 * Acts as a thin facade over the auth store for views that prefer a service interface.
 * The actual orchestration logic lives in the store (learning-center pattern).
 *
 * @returns {Object} Auth service exposing store state and actions.
 */
export const useAuthService = () => {
  const authStore = useAuthStore()

  return {
    user: authStore.user,
    token: authStore.token,
    errors: authStore.errors,
    isAuthenticated: authStore.isAuthenticated,
    signIn: authStore.signIn,
    signOut: authStore.signOut,
  }
}
