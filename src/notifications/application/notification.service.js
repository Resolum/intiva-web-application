import { ref, computed } from 'vue'
import { notificationRepository } from '@/notifications/infrastructure/notification.repository.js'
import { useAuthStore } from '@/iam/login/application/auth.store.js'

/**
 * Composable service for notification state and operations.
 * Wraps the repository and exposes reactive state for the UI.
 */
export function useNotificationService() {
  const auth = useAuthStore()

  /** @type {import('vue').Ref<Array>} */
  const notifications = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  /** Number of unread notifications */
  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
  )

  /**
   * Loads unread notifications from the API.
   * Falls back to an empty array on error so the UI never breaks.
   */
  async function fetchUnread() {
    if (!auth.user?.userId || !auth.token) return
    isLoading.value = true
    error.value = null
    try {
      const data = await notificationRepository.getUnread(auth.user.userId, auth.token)
      notifications.value = Array.isArray(data) ? data : []
    } catch (err) {
      error.value = err
      notifications.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Marks a notification as read locally and via the API.
   *
   * @param {string} notificationId
   */
  async function markRead(notificationId) {
    // Optimistic update
    const item = notifications.value.find((n) => n.id === notificationId)
    if (item) item.read = true

    try {
      await notificationRepository.markRead(notificationId, auth.token)
    } catch {
      if (item) item.read = false
    }
  }

  /**
   * Marks all visible notifications as read.
   */
  async function markAllRead() {
    const unread = notifications.value.filter((n) => !n.read)
    await Promise.allSettled(unread.map((n) => markRead(n.id)))
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchUnread,
    markRead,
    markAllRead,
  }
}
