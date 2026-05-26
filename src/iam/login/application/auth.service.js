import { useRouter } from 'vue-router'
import { authRepository } from '@/iam/login/infrastructure/auth.repository'
import { useAuthStore } from '@/iam/login/application/auth.store'
import { createLoginCredentials, validateEmail, validatePassword } from '@/iam/login/domain/auth.model'

/**
 * Composable that provides the sign-in use case and related state.
 * Designed to be called inside a Vue component's `setup()` context.
 *
 * @returns {{ signIn: Function }} Object exposing auth use case methods
 */
export const useAuthService = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  /**
   * Handles the sign-in use case for the IAM bounded context.
   * Validates user credentials, communicates with the auth repository
   * and stores the resulting token in the Pinia auth store.
   * Redirects to /dashboard on successful authentication.
   *
   * @param {string} email - The user's registered email address
   * @param {string} password - The user's account password
   * @returns {Promise<void>} Resolves when login and redirect are complete
   * @throws {Error} When email or password domain validation fails
   * @throws {Error} When the backend returns a 400 or 401 response
   * @throws {Error} When a network or server error occurs
   */
  const signIn = async (email, password) => {
    const emailError = validateEmail(email)
    if (emailError) throw new Error(emailError)

    const passwordError = validatePassword(password)
    if (passwordError) throw new Error(passwordError)

    const credentials = createLoginCredentials(email, password)
    const authData = await authRepository.signIn(credentials)

    authStore.setAuth(authData)
    await router.push('/dashboard')
  }

  return { signIn }
}
