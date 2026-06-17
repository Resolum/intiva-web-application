import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AnalyticsApi } from '@/analytics/infrastructure/analytics-api.js'
import { MetricCardAssembler } from '@/analytics/infrastructure/metric-card.assembler.js'
import { BalancePointAssembler } from '@/analytics/infrastructure/balance-point.assembler.js'
import { CategoryExpenseAssembler } from '@/analytics/infrastructure/category-expense.assembler.js'
import { IncomeVsExpenseAssembler } from '@/analytics/infrastructure/income-vs-expense.assembler.js'
import { SavingsGoalAssembler } from '@/analytics/infrastructure/savings-goal.assembler.js'
import { RecentAlertAssembler } from '@/analytics/infrastructure/recent-alert.assembler.js'

const analyticsApi = new AnalyticsApi()

/**
 * Application service store for the Analytics bounded context.
 * Coordinates dashboard data fetching via the AnalyticsApi and exposes
 * UI-facing state for metric cards, charts, goals, and alerts.
 *
 * @returns {Object} Store state and actions.
 */
export const useDashboardStore = defineStore('dashboard', () => {
  /**
   * Whether a dashboard fetch is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const isLoading       = ref(false)
  /**
   * Last error encountered during a fetch operation.
   * @type {import('vue').Ref<Error|null>}
   */
  const error           = ref(null)

  /**
   * KPI metric cards displayed at the top of the dashboard.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/metricCard.js').MetricCard>>}
   */
  const metricCards     = ref([])
  /**
   * Cumulative balance history data points for the area chart.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/balanceEvolution.js').BalancePoint>>}
   */
  const balancePoints   = ref([])
  /**
   * Expense breakdown by category for the doughnut chart.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/categoryExpense.js').CategoryExpense>>}
   */
  const categoryExpenses = ref([])
  /**
   * Monthly income vs expense pairs for the bar chart.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/incomeVsExpense.js').IncomeVsExpense>>}
   */
  const incomeVsExpenses = ref([])
  /**
   * Savings goals with progress tracking.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/savingsGoal.js').SavingsGoal>>}
   */
  const savingsGoals    = ref([])
  /**
   * Recent budget alerts and milestones.
   * @type {import('vue').Ref<Array<import('@/analytics/domain/model/recentAlert.js').RecentAlert>>}
   */
  const alerts          = ref([])
  /**
   * JSON-stringified key of the last successfully fetched params (prevents redundant fetches).
   * @type {import('vue').Ref<string|null>}
   */
  const lastParams      = ref(null)

  /**
   * Whether any metric card data is present.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const hasData = computed(() => metricCards.value.length > 0)

  /**
   * Fetches dashboard data for the given period parameters.
   * Calls the AnalyticsApi directly and assembles domain entities.
   * Skips the request if the same parameters were already fetched.
   *
   * @param {string} userId - User identifier.
   * @param {Object} params - Period filter parameters ({ periodType, periodStart, periodEnd, lastNPeriods }).
   * @returns {Promise<void>}
   */
  async function fetch(userId, params) {
    const key = JSON.stringify(params)
    if (key === lastParams.value && hasData.value) return

    isLoading.value = true
    error.value = null

    try {
      const { periodType, periodStart, periodEnd, lastNPeriods } = params

      const [summaryResult, trendResult, savingGoalsResult, spendingLimitsResult] =
        await Promise.allSettled([
          analyticsApi.getSummary(userId, { periodType, periodStart, periodEnd }),
          analyticsApi.getTrend(userId, { periodType, lastNPeriods }),
          analyticsApi.getSavingGoals(userId),
          analyticsApi.getSpendingLimits(userId, { periodType }),
        ])

      const summary        = summaryResult.status        === 'fulfilled' ? summaryResult.value.data        : {}
      const trend          = trendResult.status          === 'fulfilled' ? trendResult.value.data          : []
      const savingGoals    = savingGoalsResult.status    === 'fulfilled' ? savingGoalsResult.value.data    : {}
      const spendingLimits = spendingLimitsResult.status === 'fulfilled' ? spendingLimitsResult.value.data : {}

      if (summaryResult.status    === 'rejected') console.warn('[DashboardStore] summary failed:', summaryResult.reason?.message)
      if (trendResult.status      === 'rejected') console.warn('[DashboardStore] trend failed:', trendResult.reason?.message)
      if (savingGoalsResult.status    === 'rejected') console.warn('[DashboardStore] saving-goals failed:', savingGoalsResult.reason?.message)
      if (spendingLimitsResult.status === 'rejected') console.warn('[DashboardStore] spending-limits failed:', spendingLimitsResult.reason?.message)

      metricCards.value      = MetricCardAssembler.buildFromSummaryAndTrend(summary, trend)
      balancePoints.value    = BalancePointAssembler.buildFromTrend(trend)
      categoryExpenses.value = CategoryExpenseAssembler.buildFromSummary(summary)
      incomeVsExpenses.value = IncomeVsExpenseAssembler.buildFromTrend(trend)
      savingsGoals.value     = SavingsGoalAssembler.buildFromSavingGoals(savingGoals)
      alerts.value           = RecentAlertAssembler.buildFromSpendingLimits(spendingLimits)

      lastParams.value = key
      const totalItems = metricCards.value.length + balancePoints.value.length +
        categoryExpenses.value.length + incomeVsExpenses.value.length +
        savingsGoals.value.length + alerts.value.length
      error.value = totalItems === 0 && summaryResult.status === 'rejected'
        ? new Error('No data returned')
        : null

    } catch (err) {
      console.error('[DashboardStore] fetch failed:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  /** Resets all dashboard state to initial values. */
  function reset() {
    metricCards.value      = []
    balancePoints.value    = []
    categoryExpenses.value = []
    incomeVsExpenses.value = []
    savingsGoals.value     = []
    alerts.value           = []
    lastParams.value       = null
    error.value            = null
  }

  return {
    isLoading, error, hasData,
    metricCards, balancePoints, categoryExpenses,
    incomeVsExpenses, savingsGoals, alerts,
    fetch, reset,
  }
})
