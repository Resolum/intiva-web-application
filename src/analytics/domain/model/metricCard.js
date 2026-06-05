/**
 * Factory function for a KPI metric card shown on the dashboard.
 * Belongs to the analytics bounded context, domain layer.
 *
 * @param {string} labelKey - i18n key, e.g. 'dashboard.totalBalance'
 * @param {number} value - Numeric value in PEN
 * @param {number} trend - Percentage change vs previous period (positive = up)
 * @param {string} icon - Tabler icon name, e.g. 'wallet'
 * @returns {{ labelKey: string, value: number, trend: number, icon: string }}
 */
export function createMetricCard(labelKey, value, trend, icon) {
  return { labelKey, value, trend, icon }
}
