import { MetricCard } from '@/analytics/domain/model/metricCard.js'

function money(m) {
  return m?.amount ?? 0
}

function trendPct(current, previous) {
  if (!previous) return 0
  return parseFloat((((current - previous) / Math.abs(previous)) * 100).toFixed(1))
}

/**
 * Maps Analytics infrastructure resources into {@link MetricCard} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class MetricCardAssembler
 */
export class MetricCardAssembler {
  /**
   * Converts a raw category resource into a MetricCard entity.
   * @param {Object} resource - Resource payload with labelKey, value, trend, icon.
   * @returns {MetricCard} Mapped metric card entity.
   */
  static toEntityFromResource(resource) {
    return new MetricCard(resource.labelKey, resource.value, resource.trend, resource.icon)
  }

  /**
   * Parses an HTTP response containing metric card resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {MetricCard[]} Collection of metric card entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.metricCards ?? []
    return list.map(item => MetricCardAssembler.toEntityFromResource(item))
  }

  /**
   * Builds the four dashboard KPI cards from summary and trend API data.
   * @param {Object} summary - Financial summary payload.
   * @param {Array<Object>} trend - Balance trend payload.
   * @returns {MetricCard[]} Four metric card entities.
   */
  static buildFromSummaryAndTrend(summary, trend) {
    const prev = trend.length >= 2 ? trend[trend.length - 2] : null

    const totalIncome    = money(summary.totalIncome)
    const totalExpenses  = money(summary.totalExpenses)
    const netBalance     = money(summary.netBalance)
    const savingsRate    = summary.savingsRate ?? 0

    const prevIncome   = prev ? money(prev.totalIncome)   : 0
    const prevExpenses = prev ? money(prev.totalExpenses) : 0
    const prevBalance  = prev ? money(prev.netBalance)    : 0

    const totalBalance = trend.reduce((acc, p) => acc + money(p.netBalance), 0)
    const prevTotalBalance = trend.length >= 2
      ? trend.slice(0, -1).reduce((acc, p) => acc + money(p.netBalance), 0)
      : 0

    return [
      new MetricCard('dashboard.totalBalance',   totalBalance,   trendPct(totalBalance,  prevTotalBalance), 'credit-card'),
      new MetricCard('dashboard.monthlyIncome',  totalIncome,    trendPct(totalIncome,   prevIncome),        'arrow-up'),
      new MetricCard('dashboard.monthlyExpenses',totalExpenses,  trendPct(totalExpenses, prevExpenses),      'arrow-down'),
      new MetricCard('dashboard.netSavings',     netBalance,     trendPct(netBalance,    prevBalance),       'star'),
    ]
  }
}
