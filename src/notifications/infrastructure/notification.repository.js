import axios from 'axios'

const BASE = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PATH}`

/**
 * Repository for in-app notification endpoints.
 */
export const notificationRepository = {
  /**
   * Fetches unread notifications for a user.
   *
   * @param {string} userId
   * @param {string} token - Bearer token
   * @returns {Promise<Array>}
   */
  async getUnread(userId, token) {
    const { data } = await axios.get(`${BASE}users/${userId}/notifications/unread`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  },

  /**
   * Fetches all notifications for a user.
   *
   * @param {string} userId
   * @param {string} token
   * @returns {Promise<Array>}
   */
  async getAll(userId, token) {
    const { data } = await axios.get(`${BASE}users/${userId}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  },

  /**
   * Marks a notification as read.
   *
   * @param {string} notificationId
   * @param {string} token
   * @returns {Promise<void>}
   */
  async markRead(notificationId, token) {
    await axios.patch(`${BASE}notifications/${notificationId}/read`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
