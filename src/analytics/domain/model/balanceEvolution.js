/**
 * Balance evolution data point entity (area chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @class BalancePoint
 */
export class BalancePoint {
    /**
     * @param {string} month - ISO month string 'YYYY-MM'.
     * @param {number} balance - Net balance at end of month in PEN.
     */
    constructor(month, balance) {
        this.month = month;
        this.balance = balance;
    }
}
