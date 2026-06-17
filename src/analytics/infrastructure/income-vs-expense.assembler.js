import { IncomeVsExpense } from '@/analytics/domain/model/incomeVsExpense.js'

const MONTH_KEYS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

function money(m) {
  return m?.amount ?? 0
}

function toMonthI18nKey(periodStart) {
  const idx = parseInt(periodStart?.slice(5, 7) ?? '1', 10) - 1
  return `months.${MONTH_KEYS[Math.max(0, idx)]}`
}

/**
 * Maps Analytics infrastructure resources into {@link IncomeVsExpense} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class IncomeVsExpenseAssembler
 */
export class IncomeVsExpenseAssembler {
  /**
   * Converts a raw resource into an IncomeVsExpense entity.
   * @param {Object} resource - Resource payload with monthKey, income, expense.
   * @returns {IncomeVsExpense} Mapped income vs expense entity.
   */
  static toEntityFromResource(resource) {
    return new IncomeVsExpense(resource.monthKey, resource.income, resource.expense)
  }

  /**
   * Parses an HTTP response containing income-vs-expense resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {IncomeVsExpense[]} Collection of income vs expense entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.incomeVsExpenses ?? []
    return list.map(item => IncomeVsExpenseAssembler.toEntityFromResource(item))
  }

  /**
   * Builds income vs expense entities from the trend API data.
   * @param {Array<Object>} trend - Balance trend period objects.
   * @returns {IncomeVsExpense[]} Income vs expense entities.
   */
  static buildFromTrend(trend) {
    return trend.map(period =>
      new IncomeVsExpense(
        toMonthI18nKey(period.periodStart),
        money(period.totalIncome),
        money(period.totalExpenses),
      )
    )
  }
}
