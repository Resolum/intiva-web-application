/**
 * Notification value-carrying entity within the Communication bounded context.
 * Represents a push or in-app notification delivered to a user.
 *
 * @class Notification
 */
export class Notification {
  /**
   * @param {Object} params - Entity attributes.
   * @param {string|number|null} [params.id=null] - Notification identifier.
   * @param {string} [params.title=''] - Notification title.
   * @param {string} [params.message=''] - Notification body text.
   * @param {boolean} [params.read=false] - Whether the notification has been read.
   * @param {string|null} [params.createdAt=null] - ISO timestamp of creation.
   */
  constructor({ id, title, message, read, createdAt }) {
    this.id = id ?? null
    this.title = title ?? ''
    this.message = message ?? ''
    this.read = read ?? false
    this.createdAt = createdAt ?? null
  }
}
