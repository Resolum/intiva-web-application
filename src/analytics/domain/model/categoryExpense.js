/**
 * Expense category entry entity (doughnut chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @class CategoryExpense
 */
export class CategoryExpense {
    /**
     * @param {string} categoryKey - i18n key, e.g. 'categories.food'.
     * @param {number} amount - Amount in PEN.
     * @param {number} percentage - Percentage of total (0-100).
     * @param {string} color - Hex color from brand palette.
     */
    constructor(categoryKey, amount, percentage, color) {
        this.categoryKey = categoryKey;
        this.amount = amount;
        this.percentage = percentage;
        this.color = color;
    }
}
