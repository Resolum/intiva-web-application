import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IamApi } from '@/iam/infrastructure/iam-api.js'
import { authAssembler } from '@/iam/infrastructure/auth.assembler.js'
import { SignInCommand } from '@/iam/domain/sign-in.command.js'

const iamApi = new IamApi()

const USER_KEY   = 'auth_user'
const TOKEN_KEY  = 'auth_token'
const FAMILY_KEY = 'auth_family_id'

/**
 * Application service store for the IAM (Identity & Access Management) bounded context.
 * Coordinates authentication use cases (sign-in, sign-out) and exposes UI-facing auth state.
 * Follows the Command-Query Separation (CQS) pattern.
 *
 * @returns {Object} Store state and actions.
 */
export const useAuthStore = defineStore('auth', () => {
  /**
   * Currently authenticated user profile restored from localStorage.
   * @type {import('vue').Ref<{ userId: string, email: string }|null>}
   */
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  /**
   * Bearer token for the active session.
   * @type {import('vue').Ref<string|null>}
   */
  const token = ref(localStorage.getItem(TOKEN_KEY) || null)
  /**
   * Active family group identifier persisted across sessions.
   * @type {import('vue').Ref<string|null>}
   */
  const familyId = ref(localStorage.getItem(FAMILY_KEY) || null)
  /**
   * List of authentication errors encountered during the current session.
   * @type {import('vue').Ref<Array<Error>>}
   */
  const errors = ref([])

  /**
   * Whether a valid session token is present.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isAuthenticated = computed(() => !!token.value)

  /**
   * Current Bearer token value, or null when not authenticated.
   * @type {import('vue').ComputedRef<string|null>}
   */
  const currentToken = computed(() => isAuthenticated.value ? token.value : null)

  /**
   * Email of the currently authenticated user, or null when signed out.
   * @type {import('vue').ComputedRef<string|null>}
   */
  const currentUsername = computed(() => user.value?.email ?? null)

  /**
   * Validates a token value.
   * @param {*} v - Value to validate.
   * @returns {boolean} True if valid.
   */
  const isValidToken = (v) => typeof v === 'string' && v.trim() && v.trim() !== 'undefined'

  /**
   * Executes the sign-in use case.
   * Validates credentials, calls the API, assembles the response,
   * updates authentication state, and navigates on success.
   *
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @param {import('vue-router').Router} router - Router to redirect on result.
   * @returns {Promise<void>}
   */
  async function signIn(email, password, router) {
    if (!email || !email.includes('@')) {
      errors.value.push(new Error('login.errors.emailInvalid'))
      return
    }
    if (!password || password.length < 8) {
      errors.value.push(new Error('login.errors.passwordMinLength'))
      return
    }

    const signInCommand = new SignInCommand({ email, password })

    try {
      const response = await iamApi.signIn(signInCommand)

      const authData = authAssembler.toUser(response.data)
      if (authData && isValidToken(authData.token)) {
        user.value = { id: authData.id, email: authData.email }
        token.value = authData.token
        localStorage.setItem(TOKEN_KEY, authData.token)
        localStorage.setItem(USER_KEY, JSON.stringify(user.value))

        if (authData.familyId) {
          familyId.value = String(authData.familyId)
          localStorage.setItem(FAMILY_KEY, familyId.value)
        }

        errors.value = []
        router.push({ name: 'analytics-dashboard' })
      } else {
        errors.value.push(new Error('login.errors.invalidCredentials'))
        router.push({ name: 'iam-sign-in' })
      }
    } catch (error) {
      token.value = null
      user.value = null
      if (error.message.startsWith('login.errors.')) {
        errors.value.push(error)
      } else {
        errors.value.push(new Error('login.errors.serverError'))
      }
      router.push({ name: 'iam-sign-in' })
    }
  }

  /**
   * Stores the family group ID once it becomes known
   * (e.g. after creating or joining a group).
   * @param {string|number} id - Family group identifier.
   */
  function setFamilyId(id) {
    familyId.value = String(id)
    localStorage.setItem(FAMILY_KEY, familyId.value)
  }

  /** Clears the active IAM session and all local auth artifacts. */
  function signOut() {
    user.value = null
    token.value = null
    familyId.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(FAMILY_KEY)
    errors.value = []
  }

  return {
    user,
    token,
    familyId,
    errors,
    isAuthenticated,
    currentToken,
    currentUsername,
    signIn,
    setFamilyId,
    signOut,
  }
})
