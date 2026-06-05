/**
 * Factory function for a savings goal with progress tracking.
 * Belongs to the analytics bounded context, domain layer.
 * The `progress` field is derived: saved / target (0–1).
 *
 * @param {string} goalKey - i18n key, e.g. 'goals.vacations'
 * @param {number} saved - Amount already saved in PEN
 * @param {number} target - Target amount in PEN
 * @returns {{ goalKey: string, saved: number, target: number, progress: number }}
 */
export function createSavingsGoal(goalKey, saved, target) {
  return {
    goalKey,
    saved,
    target,
    get progress() {
      return this.target > 0 ? Math.min(this.saved / this.target, 1) : 0
    }
  }
}
