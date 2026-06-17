/**
 * Monthly income vs expense pair entity (bar chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @class IncomeVsExpense
 */
export class IncomeVsExpense {
    /**
     * @param {string} monthKey - i18n key, e.g. 'months.jan'.
     * @param {number} income - Income amount in PEN.
     * @param {number} expense - Expense amount in PEN.
     */
    constructor(monthKey, income, expense) {
        this.monthKey = monthKey;
        this.income = income;
        this.expense = expense;
    }
}
