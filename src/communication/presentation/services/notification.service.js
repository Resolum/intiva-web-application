import { useNotificationStore } from '@/communication/application/notification.store.js'

/**
 * Presentation service for notification use cases.
 * Acts as a thin facade over the notification store.
 * The actual orchestration logic (API calls, FCM) lives in the store.
 *
 * @returns {Object} Notification service exposing store state and actions.
 */
export function useNotificationService() {
  const notificationStore = useNotificationStore()

  return {
    notifications: notificationStore.notifications,
    unreadCount: notificationStore.unreadCount,
    isLoading: notificationStore.isLoading,
    error: notificationStore.error,
    initializeNotifications: notificationStore.initializeNotifications,
    fetchUnread: notificationStore.fetchUnread,
    fetchAll: notificationStore.fetchAll,
    markRead: notificationStore.markRead,
    markAllRead: notificationStore.markAllRead,
    addNotification: notificationStore.addNotification,
    clearNotifications: notificationStore.clearNotifications,
  }
}
