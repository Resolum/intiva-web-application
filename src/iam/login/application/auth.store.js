import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Pinia store for authentication state management.
 * Uses the Composition API setup syntax for full TypeScript-friendly reactivity.
 *
 * @returns {{ user: Ref, token: Ref, isAuthenticated: ComputedRef, setAuth: Function, clearAuth: Function }}
 */
export const useAuthStore = defineStore('auth', () => {
  /** @type {import('vue').Ref<{ userId: string, email: string }|null>} Currently authenticated user */
  const user = ref(null)

  /** @type {import('vue').Ref<string|null>} JWT bearer token */
  const token = ref(localStorage.getItem('auth_token') || null)

  /**
   * Whether a user is currently authenticated.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isAuthenticated = computed(() => !!token.value)

  /**
   * Stores authentication data received after a successful login.
   *
   * @param {{ userId: string, email: string, token: string }} authData - Data from the auth repository
   * @returns {void}
   */
  function setAuth(authData) {
    user.value = { userId: authData.userId, email: authData.email }
    token.value = authData.token
    localStorage.setItem('auth_token', authData.token)
  }

  /**
   * Clears all authentication state and removes the token from storage.
   * Called during logout.
   *
   * @returns {void}
   */
  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  return { user, token, isAuthenticated, setAuth, clearAuth }
})
