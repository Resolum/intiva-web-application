/**
 * Factory function for a balance evolution data point (area chart).
 * Belongs to the analytics bounded context, domain layer.
 *
 * @param {string} month - ISO month string 'YYYY-MM'
 * @param {number} balance - Net balance at end of month in PEN
 * @returns {{ month: string, balance: number }}
 */
export function createBalancePoint(month, balance) {
  return { month, balance }
}
