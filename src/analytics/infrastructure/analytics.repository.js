const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

/**
 * Analytics HTTP repository.
 * All methods are async to be ready for real network calls.
 */
export const analyticsRepository = {
  /**
   * Fetches dashboard summary KPIs for the authenticated user.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/dashboard`)
   *
   * @param {string} userId - Authenticated user identifier
   * @returns {Promise<object>} Dashboard metrics payload
   */
  async getDashboardMetrics(userId) {
    // Mock — replace with real API call
    return Promise.resolve({ userId, fetched: true })
  },

  /**
   * Fetches balance evolution time-series data.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/balance-evolution`)
   *
   * @param {string} userId - Authenticated user identifier
   * @param {string} range - Time range: '1M' | '6M' | '1Y'
   * @returns {Promise<Array>} Array of { month, balance } points
   */
  async getBalanceEvolution(userId, range) {
    return Promise.resolve([])
  },

  /**
   * Fetches expense breakdown by category.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/expenses-by-category`)
   *
   * @param {string} userId - Authenticated user identifier
   * @returns {Promise<Array>} Array of category expense objects
   */
  async getCategoryExpenses(userId) {
    return Promise.resolve([])
  },

  /**
   * Fetches monthly income vs expense pairs.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/income-vs-expenses`)
   *
   * @param {string} userId - Authenticated user identifier
   * @returns {Promise<Array>} Array of { monthKey, income, expense }
   */
  async getIncomeVsExpenses(userId) {
    return Promise.resolve([])
  },

  /**
   * Fetches savings goals with progress data.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/savings-goals`)
   *
   * @param {string} userId - Authenticated user identifier
   * @returns {Promise<Array>} Array of savings goal objects
   */
  async getSavingsGoals(userId) {
    return Promise.resolve([])
  },

  /**
   * Fetches recent financial alerts for the user.
   * TODO: Replace with axios.get(`${API_BASE_URL}${API_PATH}analytics/alerts`)
   *
   * @param {string} userId - Authenticated user identifier
   * @returns {Promise<Array>} Array of alert objects
   */
  async getRecentAlerts(userId) {
    return Promise.resolve([])
  },
}
