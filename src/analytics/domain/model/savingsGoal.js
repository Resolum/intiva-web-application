/**
 * Savings goal entity with progress tracking.
 * Belongs to the analytics bounded context, domain layer.
 * The `progress` property is derived: saved / target (0-1).
 *
 * @class SavingsGoal
 */
export class SavingsGoal {
    /**
     * @param {string} goalKey - i18n key, e.g. 'goals.vacations'.
     * @param {number} saved - Amount already saved in PEN.
     * @param {number} target - Target amount in PEN.
     */
    constructor(goalKey, saved, target) {
        this.goalKey = goalKey;
        this.saved = saved;
        this.target = target;
    }

    /**
     * Returns the progress ratio (0-1).
     * @returns {number}
     */
    get progress() {
        return this.target > 0 ? Math.min(this.saved / this.target, 1) : 0;
    }
}
