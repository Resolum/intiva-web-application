/**
 * Factory function for a recent financial alert or notification.
 * Belongs to the analytics bounded context, domain layer.
 * Alert types: 'budget' | 'milestone' | 'shared'
 *
 * @param {string} id - Unique identifier
 * @param {string} type - Alert type: 'budget', 'milestone' or 'shared'
 * @param {string} titleKey - i18n key for the title
 * @param {string} descriptionKey - i18n key for the description
 * @param {string} icon - Tabler icon name
 * @param {string} color - Hex color for the icon bubble
 * @returns {object}
 */
export function createRecentAlert(id, type, titleKey, descriptionKey, icon, color) {
  return { id, type, titleKey, descriptionKey, icon, color }
}
