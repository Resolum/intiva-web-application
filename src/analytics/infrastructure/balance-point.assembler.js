import { BalancePoint } from '@/analytics/domain/model/balanceEvolution.js'

function money(m) {
  return m?.amount ?? 0
}

function toMonthKey(periodStart) {
  return periodStart?.slice(0, 7) ?? ''
}

/**
 * Maps Analytics infrastructure resources into {@link BalancePoint} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class BalancePointAssembler
 */
export class BalancePointAssembler {
  /**
   * Converts a raw resource into a BalancePoint entity.
   * @param {Object} resource - Resource payload with month and balance.
   * @returns {BalancePoint} Mapped balance point entity.
   */
  static toEntityFromResource(resource) {
    return new BalancePoint(resource.month, resource.balance)
  }

  /**
   * Parses an HTTP response containing balance point resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {BalancePoint[]} Collection of balance point entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.balancePoints ?? []
    return list.map(item => BalancePointAssembler.toEntityFromResource(item))
  }

  /**
   * Builds a cumulative balance history from the trend API data.
   * @param {Array<Object>} trend - Balance trend period objects.
   * @returns {BalancePoint[]} Cumulative balance points.
   */
  static buildFromTrend(trend) {
    let running = 0
    return trend.map(period => {
      running += money(period.netBalance)
      return new BalancePoint(toMonthKey(period.periodStart), running)
    })
  }
}
