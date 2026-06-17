import { AnalyticsApi } from '@/analytics/infrastructure/analytics-api.js'
import { MetricCardAssembler } from '@/analytics/infrastructure/metric-card.assembler.js'
import { BalancePointAssembler } from '@/analytics/infrastructure/balance-point.assembler.js'
import { CategoryExpenseAssembler } from '@/analytics/infrastructure/category-expense.assembler.js'
import { IncomeVsExpenseAssembler } from '@/analytics/infrastructure/income-vs-expense.assembler.js'
import { SavingsGoalAssembler } from '@/analytics/infrastructure/savings-goal.assembler.js'
import { RecentAlertAssembler } from '@/analytics/infrastructure/recent-alert.assembler.js'

const analyticsApi = new AnalyticsApi()

/**
 * Presentation service for the Analytics bounded context.
 * Orchestrates API calls and assembles dashboard data for views.
 *
 * @returns {{ loadDashboard: Function }} Service interface.
 */
export function useAnalyticsService() {
  /**
   * Loads all dashboard data (metric cards, charts, goals, alerts) for the given user and period.
   * @param {{ userId: string }} auth - Authenticated user profile.
   * @param {{ periodType: string, periodStart: string, periodEnd: string, lastNPeriods: number }} params - Period filter.
   * @returns {Promise<{ metricCards: Object[], balancePoints: Object[], categoryExpenses: Object[], incomeVsExpenses: Object[], savingsGoals: Object[], alerts: Object[] }>} Dashboard data.
   */
  async function loadDashboard(auth, { periodType, periodStart, periodEnd, lastNPeriods }) {
    const userId = auth.userId

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

    if (summaryResult.status        === 'rejected') console.warn('[Analytics] summary failed:', summaryResult.reason?.message)
    if (trendResult.status          === 'rejected') console.warn('[Analytics] trend failed:', trendResult.reason?.message)
    if (savingGoalsResult.status    === 'rejected') console.warn('[Analytics] saving-goals failed:', savingGoalsResult.reason?.message)
    if (spendingLimitsResult.status === 'rejected') console.warn('[Analytics] spending-limits failed:', spendingLimitsResult.reason?.message)

    return {
      metricCards:      MetricCardAssembler.buildFromSummaryAndTrend(summary, trend),
      balancePoints:    BalancePointAssembler.buildFromTrend(trend),
      categoryExpenses: CategoryExpenseAssembler.buildFromSummary(summary),
      incomeVsExpenses: IncomeVsExpenseAssembler.buildFromTrend(trend),
      savingsGoals:     SavingsGoalAssembler.buildFromSavingGoals(savingGoals),
      alerts:           RecentAlertAssembler.buildFromSpendingLimits(spendingLimits),
    }
  }

  return { loadDashboard }
}
