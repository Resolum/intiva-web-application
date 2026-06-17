/**
 * Normalises a token value extracted from the auth response.
 * @param {*} value - Raw token value.
 * @returns {string|null} Cleaned token or null when absent.
 */
const normalizeToken = (value) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed && trimmed !== 'undefined' ? trimmed : null
}

/**
 * Normalises a string value extracted from the auth response.
 * @param {*} value - Raw string value.
 * @returns {string|null} Cleaned string or null when absent.
 */
const normalizeString = (value) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed && trimmed !== 'undefined' ? trimmed : null
}

/**
 * Normalises a user identifier from various possible types.
 * @param {*} value - Raw user identifier.
 * @returns {string|null} Normalised identifier or null when absent.
 */
const normalizeUserId = (value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed && trimmed !== 'undefined' ? trimmed : null
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }
  return null
}

/**
 * Safely unwraps a nested API response payload to find the data object.
 * @param {*} payload - Raw API response.
 * @returns {*} Unwrapped payload.
 */
const unwrapResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  if (payload.data && typeof payload.data === 'object') return payload.data
  if (payload.payload && typeof payload.payload === 'object') return payload.payload
  return payload
}

/**
 * Resolves the user sub-object from a heterogeneous API response shape.
 * @param {Object} data - Unwrapped API response data.
 * @returns {{ userId: string|null, email: string|null }} Normalised user identity.
 */
const resolveUser = (data) => {
  const candidate = data.user && typeof data.user === 'object' ? data.user : data

  return {
    userId: candidate.userId ?? candidate.id ?? candidate.uuid ?? null,
    email: candidate.email ?? candidate.username ?? null,
  }
}

import { User } from '@/iam/domain/user.entity.js'

/**
 * Maps IAM authentication responses into domain entities.
 * Belongs to the infrastructure layer of the IAM bounded context.
 *
 * @class AuthAssembler
 */
export const authAssembler = {
  /**
   * Creates a credential object from raw email and password values.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {{ email: string, password: string }} Normalised credentials.
   */
  toCredentials(email, password) {
    return { email: email.trim().toLowerCase(), password }
  },

  /**
   * Converts a sign-in response into a User entity with the attached Bearer token.
   * Throws when required fields (token, userId, email) are missing or malformed.
   *
   * @param {Object} response - Raw sign-in response data.
   * @returns {User} User entity with token attached.
   * @throws {Error} When the response does not contain valid credentials.
   */
  toUser(response) {
    const data = unwrapResponse(response)
    const { userId, email } = resolveUser(data)

    const token = normalizeToken(
      data.token ?? data.accessToken ?? data.access_token ?? data.authToken,
    )

    if (!token || !normalizeUserId(userId) || !normalizeString(email)) {
      throw new Error('login.errors.invalidCredentials')
    }

    const user = new User({ id: normalizeUserId(userId), email })

    const candidate = data.user && typeof data.user === 'object' ? data.user : data
    const familyId = normalizeUserId(
      data.familyId ?? candidate.familyId ?? data.family?.id ?? candidate.family?.id ?? null,
    )

    return { ...user, token, familyId }
  },
}
