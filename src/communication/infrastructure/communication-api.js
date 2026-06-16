import { BaseApi } from '@/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js';
import { authInterceptor, authErrorHandler } from '@/shared/infrastructure/auth.interceptor.js';

const notificationDevicesPath = import.meta.env.VITE_NOTIFICATION_DEVICES_API_URL || 'notification-devices';
const notificationsPath = import.meta.env.VITE_NOTIFICATIONS_API_URL || 'notifications';

/**
 * Infrastructure gateway for the Communication (notifications) bounded-context endpoints.
 * Provides device registration and notification operations.
 *
 * @class CommunicationApi
 * @extends BaseApi
 */
export class CommunicationApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #notificationDevicesEndpoint;
    /** @type {BaseEndpoint} */
    #notificationsEndpoint;

    /** Creates endpoint clients and attaches auth interceptors. */
    constructor() {
        super();
        this.addRequestInterceptor(authInterceptor);
        this.addResponseInterceptor(null, authErrorHandler);
        this.#notificationDevicesEndpoint = new BaseEndpoint(this, notificationDevicesPath);
        this.#notificationsEndpoint = new BaseEndpoint(this, notificationsPath);
    }

    /**
     * Fetches device tokens for a user.
     * @param {string} userId - User identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Device tokens response.
     */
    getDeviceTokens(userId) {
        return this.#notificationDevicesEndpoint.http.get(
            this.#notificationDevicesEndpoint.endpointPath,
            { params: { userId } },
        );
    }

    /**
     * Registers a device token for push notifications.
     * @param {Object} body - Device token payload.
     * @returns {Promise<import('axios').AxiosResponse<void>>} Empty response.
     */
    registerDeviceToken(body) {
        return this.#notificationDevicesEndpoint.create(body);
    }

    /**
     * Fetches notifications for a user.
     * @param {string} userId - User identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Notifications response.
     */
    getNotifications(userId) {
        return this.#notificationsEndpoint.http.get(
            this.#notificationsEndpoint.endpointPath,
            { params: { userId } },
        );
    }

    /**
     * Fetches unread notifications for a user.
     * @param {string} userId - User identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Unread notifications response.
     */
    getUnreadNotifications(userId) {
        return this.#notificationsEndpoint.http.get(
            `${this.#notificationsEndpoint.endpointPath}/unread`,
            { params: { userId } },
        );
    }

    /**
     * Marks a notification as read.
     * @param {string|number} notificationId - Notification identifier.
     * @returns {Promise<import('axios').AxiosResponse<void>>} Empty response.
     */
    markNotificationRead(notificationId) {
        return this.#notificationsEndpoint.http.patch(
            `${this.#notificationsEndpoint.endpointPath}/${notificationId}/read`,
        );
    }
}
