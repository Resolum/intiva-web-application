import { FinancialSummary } from '@/analytics/domain/model/report.js'

function money(m) {
  if (typeof m === 'number') return m
  return m?.amount ?? 0
}

/**
 * Maps Analytics infrastructure resources into {@link FinancialSummary} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class FinancialSummaryAssembler
 */
export class FinancialSummaryAssembler {
  /**
   * Converts a raw resource into a FinancialSummary entity.
   * @param {Object} resource - Resource payload with totalIncome, totalExpenses, netSavings.
   * @returns {FinancialSummary} Mapped financial summary entity.
   */
  static toEntityFromResource(resource) {
    return new FinancialSummary(resource.totalIncome, resource.totalExpenses, resource.netSavings)
  }

  /**
   * Builds a preview data structure for the report view,
   * extracting summary, chart data, and transaction list from the merged API response.
   * @param {Object} data - Merged report data from the API.
   * @returns {{ summary: FinancialSummary, chartData: Object[], transactions: Object[] }} Preview data.
   */
  static toPreviewData(data) {
    const payload = data?.summary ? data.summary : data

    const totalIncome = (
      money(payload.totalIncome) || money(payload.income) || money(payload.incomes?.total) || money(payload.totals?.income)
    )
    const totalExpenses = (
      money(payload.totalExpenses) || money(payload.expenses) || money(payload.expenses?.total) || money(payload.totals?.expenses)
    )
    const netBalance = (
      money(payload.netBalance) || money(payload.netSavings) || money(payload.net_balance) || (totalIncome - totalExpenses)
    )

    const summary = new FinancialSummary(totalIncome, totalExpenses, netBalance)

    const categories = payload.topCategories ?? payload.expensesByCategory ?? payload.categories ?? payload.categoryRanking ?? []
    const chartData = categories.map(c => ({
      categoryKey: c.categoryName || c.name || c.label || c.categoryKey,
      amount: money(c.totalAmount ?? c.amount ?? c.total ?? c.value),
      percentage: parseFloat(c.percentage ?? c.percent ?? 0),
      color: c.categoryColor || c.color || '#534AB7',
    }))

    const rawTransactions = data.transactions ?? data.items ?? payload.transactions ?? payload.transactionList ?? []
    const transactions = rawTransactions.map(t => ({
      id: t.id ?? t.transactionId ?? t.txId,
      date: t.date ?? t.transactionDate ?? t.txDate,
      description: t.description ?? t.transactionDescription ?? t.note,
      category: t.category ?? t.categoryName ?? t.categoryLabel ?? t.categoryKey,
      amount: money(t.amount ?? t.transactionAmount ?? t.value ?? t.txAmount),
    }))

    return { summary, chartData, transactions }
  }
}
