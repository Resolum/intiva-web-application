/**
 * Stubbed Firebase FCM integration.
 *
 * Add the Firebase SDK and implement these helpers when wiring FCM.
 */

/**
 * Initialises the Firebase app and messaging instance.
 * @returns {Promise<null>} Resolves once Firebase is ready.
 */
export async function initializeFirebaseMessaging() {
  // TODO: initialize firebase/app and firebase/messaging here.
  return null
}

/**
 * Requests notification permission and returns the FCM device token.
 * @returns {Promise<null>} Resolves with the FCM token once obtained.
 */
export async function requestFirebaseToken() {
  // TODO: request notification permission and return the FCM token.
  return null
}

/**
 * Subscribes to incoming FCM messages.
 * @param {Function} callback - Handler invoked with each incoming message payload.
 * @returns {Function} Unsubscribe function to stop listening.
 */
export function onFirebaseMessage(callback) {
  // TODO: subscribe to incoming FCM messages and invoke callback.
  return () => {}
}
