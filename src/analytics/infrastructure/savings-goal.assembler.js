import { SavingsGoal } from '@/analytics/domain/model/savingsGoal.js'

function money(m) {
  return m?.amount ?? 0
}

/**
 * Maps Analytics infrastructure resources into {@link SavingsGoal} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class SavingsGoalAssembler
 */
export class SavingsGoalAssembler {
  /**
   * Converts a raw resource into a SavingsGoal entity.
   * @param {Object} resource - Resource payload with goalKey, saved, target.
   * @returns {SavingsGoal} Mapped savings goal entity.
   */
  static toEntityFromResource(resource) {
    return new SavingsGoal(resource.goalKey, resource.saved, resource.target)
  }

  /**
   * Parses an HTTP response containing savings goal resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {SavingsGoal[]} Collection of savings goal entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.savingsGoals ?? data.details ?? []
    return list.map(item => SavingsGoalAssembler.toEntityFromResource(item))
  }

  /**
   * Builds savings goal entities from the saving-goals API data.
   * @param {Object} savingGoals - Saving goals payload with details array.
   * @returns {SavingsGoal[]} Savings goal entities.
   */
  static buildFromSavingGoals(savingGoals) {
    const details = savingGoals.details ?? []
    return details.map(g =>
      new SavingsGoal(
        g.title,
        money(g.currentAmount),
        money(g.targetAmount),
      )
    )
  }
}
