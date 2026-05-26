/**
 * Factory function for a monthly income vs expense pair (bar chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @param {string} monthKey - i18n key, e.g. 'months.jan'
 * @param {number} income - Income amount in PEN
 * @param {number} expense - Expense amount in PEN
 * @returns {{ monthKey: string, income: number, expense: number }}
 */
export function createIncomeVsExpense(monthKey, income, expense) {
  return { monthKey, income, expense }
}
