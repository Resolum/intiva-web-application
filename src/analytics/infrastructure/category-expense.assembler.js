import { CategoryExpense } from '@/analytics/domain/model/categoryExpense.js'

const PALETTE = ['#534AB7','#CDEB45','#7F77DD','#8A4900','#1D9E75','#378ADD','#D85A30','#EF9F27']

function money(m) {
  return m?.amount ?? 0
}

/**
 * Maps Analytics infrastructure resources into {@link CategoryExpense} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class CategoryExpenseAssembler
 */
export class CategoryExpenseAssembler {
  /**
   * Converts a raw resource into a CategoryExpense entity.
   * @param {Object} resource - Resource payload with categoryKey, amount, percentage, color.
   * @returns {CategoryExpense} Mapped category expense entity.
   */
  static toEntityFromResource(resource) {
    return new CategoryExpense(resource.categoryKey, resource.amount, resource.percentage, resource.color)
  }

  /**
   * Parses an HTTP response containing category expense resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {CategoryExpense[]} Collection of category expense entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.categoryExpenses ?? data.expensesByCategory ?? []
    return list.map(item => CategoryExpenseAssembler.toEntityFromResource(item))
  }

  /**
   * Builds category expense entities from the summary API data.
   * @param {Object} summary - Financial summary payload with expensesByCategory.
   * @returns {CategoryExpense[]} Category expense entities.
   */
  static buildFromSummary(summary) {
    const cats = summary.expensesByCategory ?? []
    return cats.map((cat, i) =>
      new CategoryExpense(
        cat.categoryName,
        money(cat.totalAmount),
        cat.percentage ?? 0,
        cat.categoryColor || PALETTE[i % PALETTE.length],
      )
    )
  }
}
