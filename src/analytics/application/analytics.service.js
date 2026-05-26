import { createMetricCard }       from '@/analytics/domain/model/metricCard.js'
import { createBalancePoint }     from '@/analytics/domain/model/balanceEvolution.js'
import { createCategoryExpense }  from '@/analytics/domain/model/categoryExpense.js'
import { createIncomeVsExpense }  from '@/analytics/domain/model/incomeVsExpense.js'
import { createSavingsGoal }      from '@/analytics/domain/model/savingsGoal.js'
import { createRecentAlert }      from '@/analytics/domain/model/recentAlert.js'

export function useAnalyticsApplicationService() {

  /**
   * Returns the four KPI metric cards for the dashboard header.
   *
   * @returns {Array<{labelKey, value, trend, icon}>}
   */
  function getMetricCards() {
    return [
      createMetricCard('dashboard.totalBalance',    12765,  2.4, 'wallet'),
      createMetricCard('dashboard.monthlyIncome',    3200,  5.1, 'trending-up'),
      createMetricCard('dashboard.monthlyExpenses',  1980, -1.2, 'trending-down'),
      createMetricCard('dashboard.netSavings',       1220, 10.0, 'piggy-bank'),
    ]
  }

  /**
   * Returns time-series balance data for the area chart.
   * Filters points based on the selected time range.
   *
   * @param {string} range - '1M' | '6M' | '1Y'
   * @returns {Array<{month, balance}>}
   */
  function getBalanceEvolution(range) {
    const allPoints = [
      createBalancePoint('2024-06',  8200),
      createBalancePoint('2024-07',  8750),
      createBalancePoint('2024-08',  7900),
      createBalancePoint('2024-09',  9100),
      createBalancePoint('2024-10',  9800),
      createBalancePoint('2024-11',  9300),
      createBalancePoint('2024-12', 10200),
      createBalancePoint('2025-01', 10800),
      createBalancePoint('2025-02', 11400),
      createBalancePoint('2025-03', 10900),
      createBalancePoint('2025-04', 12100),
      createBalancePoint('2025-05', 12765),
    ]
    if (range === '1M') return allPoints.slice(-1)
    if (range === '6M') return allPoints.slice(-6)
    return allPoints
  }

  /**
   * Returns expense breakdown by category for the doughnut chart.
   *
   * @returns {Array<{categoryKey, amount, percentage, color}>}
   */
  function getCategoryExpenses() {
    return [
      createCategoryExpense('categories.food',         594, 30, '#534AB7'),
      createCategoryExpense('categories.rent',         495, 25, '#CDEB45'),
      createCategoryExpense('categories.transport',    396, 20, '#7F77DD'),
      createCategoryExpense('categories.entertainment',297, 15, '#8A4900'),
      createCategoryExpense('categories.health',       198, 10, '#1D9E75'),
    ]
  }

  /**
   * Returns monthly income vs expense data for the grouped bar chart.
   *
   * @returns {Array<{monthKey, income, expense}>}
   */
  function getIncomeVsExpenses() {
    return [
      createIncomeVsExpense('months.jan', 3100, 2100),
      createIncomeVsExpense('months.feb', 3200, 1950),
      createIncomeVsExpense('months.mar', 2900, 2200),
      createIncomeVsExpense('months.apr', 3400, 2050),
      createIncomeVsExpense('months.may', 3200, 1980),
    ]
  }

  /**
   * Returns savings goals with their progress ratio (0–1).
   *
   * @returns {Array<{goalKey, saved, target, progress}>}
   */
  function getSavingsGoals() {
    return [
      createSavingsGoal('goals.vacations',      4500,  5000),
      createSavingsGoal('goals.newCar',        12000, 40000),
      createSavingsGoal('goals.emergencyFund',  8000, 10000),
    ]
  }

  /**
   * Returns the three most recent financial alerts.
   *
   * @returns {Array<{id, type, titleKey, descriptionKey, icon, color}>}
   */
  function getRecentAlerts() {
    return [
      createRecentAlert('alert-1', 'budget',    'alerts.budgetAlert',      'alerts.budgetAlertDesc',      'alert-triangle', '#D85A30'),
      createRecentAlert('alert-2', 'milestone', 'alerts.savingsMilestone', 'alerts.savingsMilestoneDesc', 'trophy',         '#CDEB45'),
      createRecentAlert('alert-3', 'shared',    'alerts.sharedExpense',    'alerts.sharedExpenseDesc',    'users',          '#534AB7'),
    ]
  }

  return {
    getMetricCards,
    getBalanceEvolution,
    getCategoryExpenses,
    getIncomeVsExpenses,
    getSavingsGoals,
    getRecentAlerts,
  }
}
