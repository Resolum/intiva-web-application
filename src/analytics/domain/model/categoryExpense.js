/**
 * Factory function for an expense category entry (doughnut chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @param {string} categoryKey - i18n key, e.g. 'categories.food'
 * @param {number} amount - Amount in PEN
 * @param {number} percentage - Percentage of total (0–100)
 * @param {string} color - Hex color from brand palette
 * @returns {{ categoryKey: string, amount: number, percentage: number, color: string }}
 */
export function createCategoryExpense(categoryKey, amount, percentage, color) {
  return { categoryKey, amount, percentage, color }
}
