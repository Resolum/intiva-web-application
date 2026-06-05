import axios from 'axios'

/** Base URL for the authentication API endpoints. */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH
const SIGN_IN_PATH = import.meta.env.VITE_SIGN_IN_PATH

/**
 * Repository object responsible for all auth-related HTTP calls.
 * Isolates the infrastructure concern from the application layer.
 */
export const authRepository = {
  /**
   * Sends sign-in credentials to the backend authentication API.
   *
   * @param {{ email: string, password: string }} credentials - The user's login credentials
   * @returns {Promise<{ userId: string, email: string, token: string }>} The authenticated user data with JWT token
   * @throws {Error} When the server responds with a 400 or 401 (invalid credentials)
   * @throws {Error} When a network error or unexpected server error occurs
   */
  async signIn(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}${API_PATH}${SIGN_IN_PATH}`, credentials)
      return response.data
    } catch (error) {
      if (error.response) {
        const status = error.response.status
        if (status === 400 || status === 401) {
          throw new Error('login.errors.invalidCredentials')
        }
      }
      throw new Error('login.errors.serverError')
    }
  },
}
