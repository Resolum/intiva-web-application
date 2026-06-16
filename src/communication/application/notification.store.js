import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CommunicationApi } from '@/communication/infrastructure/communication-api.js'
import { NotificationAssembler } from '@/communication/infrastructure/notification.assembler.js'
import {
  initializeFirebaseMessaging,
  onFirebaseMessage,
  requestFirebaseToken,
} from '@/communication/infrastructure/firebase-messaging.js'

const communicationApi = new CommunicationApi()

/**
 * Application service store for the Communication (notifications) bounded context.
 * Coordinates notification fetching, Firebase Cloud Messaging initialisation,
 * and exposes UI-facing notification state.
 *
 * @returns {Object} Store state and actions.
 */
export const useNotificationStore = defineStore('notification', () => {
  /**
   * List of notification entities.
   * @type {import('vue').Ref<Array<import('@/communication/domain/model/notification.entity.js').Notification>>}
   */
  const notifications = ref([])
  /**
   * Whether a notification fetch is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const isLoading = ref(false)
  /**
   * Last error encountered during a notification operation.
   * @type {import('vue').Ref<Error|null>}
   */
  const error = ref(null)

  /**
   * Number of unread notifications computed from the current list.
   * @type {import('vue').ComputedRef<number>}
   */
  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
  )

  /**
   * Initialises Firebase Cloud Messaging and listens for incoming messages.
   * @returns {Promise<void>}
   */
  async function initializeNotifications() {
    try {
      await initializeFirebaseMessaging()
      await requestFirebaseToken()

      onFirebaseMessage((message) => {
        const notification = NotificationAssembler.toNotification(message)
        notifications.value.unshift(notification)
      })
    } catch (err) {
      console.warn('[NotificationStore] FCM initialization failed:', err)
      error.value = err
    }
  }

  /**
   * Fetches unread notifications for the given user.
   * @param {string} userId - User identifier.
   * @returns {Promise<void>}
   */
  async function fetchUnread(userId) {
    if (!userId) return
    isLoading.value = true
    error.value = null
    try {
      const response = await communicationApi.getUnreadNotifications(userId)
      notifications.value = NotificationAssembler.toNotificationList(response.data)
    } catch (err) {
      error.value = err
      notifications.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches all notifications for the given user.
   * @param {string} userId - User identifier.
   * @returns {Promise<void>}
   */
  async function fetchAll(userId) {
    if (!userId) return
    isLoading.value = true
    error.value = null
    try {
      const response = await communicationApi.getNotifications(userId)
      notifications.value = NotificationAssembler.toNotificationList(response.data)
    } catch (err) {
      error.value = err
      notifications.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Marks a notification as read via the API and updates local state.
   * @param {string|number} notificationId - Notification identifier.
   * @returns {Promise<void>}
   */
  async function markRead(notificationId) {
    const item = notifications.value.find((n) => n.id === notificationId)
    if (item) item.read = true
    try {
      await communicationApi.markNotificationRead(notificationId)
    } catch (err) {
      console.warn('[NotificationStore] markRead failed:', err)
      error.value = err
    }
  }

  /**
   * Marks all unread notifications as read.
   * @returns {Promise<void>}
   */
  async function markAllRead() {
    const unread = notifications.value.filter((n) => !n.read)
    await Promise.allSettled(unread.map((n) => markRead(n.id)))
  }

  /**
   * Adds a single notification to the top of the list (used for real-time messages).
   * @param {Object} item - Notification object.
   */
  function addNotification(item) {
    notifications.value.unshift(item)
  }

  /** Clears all notifications from local state. */
  function clearNotifications() {
    notifications.value = []
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    initializeNotifications,
    fetchUnread,
    fetchAll,
    markRead,
    markAllRead,
    addNotification,
    clearNotifications,
  }
})
