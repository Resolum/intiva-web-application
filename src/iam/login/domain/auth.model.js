/**
 * Creates a login credentials value object.
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {{ email: string, password: string }} Immutable credentials object
 */
export const createLoginCredentials = (email, password) => ({
  email: email.trim().toLowerCase(),
  password,
})

/**
 * Validates an email address format using RFC-compliant regex.
 *
 * @param {string} email - The email address to validate
 * @returns {string|null} An error message key if invalid, or null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'login.errors.emailRequired'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'login.errors.emailInvalid'
  }
  return null
}

/**
 * Validates that a password meets minimum security requirements.
 * Currently requires at least 8 characters.
 *
 * @param {string} password - The password to validate
 * @returns {string|null} An error message key if invalid, or null if valid
 */
export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'login.errors.passwordRequired'
  }
  if (password.length < 8) {
    return 'login.errors.passwordMinLength'
  }
  return null
}
