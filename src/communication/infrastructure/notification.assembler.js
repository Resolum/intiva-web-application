import { Notification } from '@/communication/domain/model/notification.entity.js'

/**
 * Maps Communication infrastructure resources into {@link Notification} domain entities.
 * Belongs to the infrastructure layer of the Communication bounded context.
 *
 * @class NotificationAssembler
 */
export class NotificationAssembler {
  /**
   * Converts a raw resource into a Notification entity.
   * @param {Object} resource - Resource payload with id, title, message, read, createdAt.
   * @returns {Notification} Mapped notification entity.
   */
  static toEntityFromResource(resource) {
    return new Notification({
      id: resource.id ?? resource.notificationId,
      title: resource.title ?? resource.subject,
      message: resource.message ?? resource.body,
      read: resource.read ?? resource.isRead ?? false,
      createdAt: resource.createdAt ?? resource.createdDate,
    })
  }

  /**
   * Parses an HTTP response containing notification resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {Notification[]} Collection of notification entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.notifications ?? data.items ?? []
    return list.map(item => NotificationAssembler.toEntityFromResource(item))
  }

  /**
   * Converts a raw message into a Notification entity.
   * @param {Object} raw - Raw message payload.
   * @returns {Notification} Mapped notification entity.
   */
  static toNotification(raw) {
    return NotificationAssembler.toEntityFromResource(raw)
  }

  /**
   * Converts an array of raw API responses into Notification entities.
   * @param {Object[]} data - Array of API response objects.
   * @returns {Notification[]} Collection of mapped notification entities.
   */
  static toNotificationList(data) {
    const items = Array.isArray(data) ? data : []
    return items.map(item => NotificationAssembler.toEntityFromResource(item))
  }
}
