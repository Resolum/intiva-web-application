/**
 * Available report type options.
 * @enum {string}
 */
export const ReportType = {
  GENERAL: 'general',
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings'
}

/**
 * Available export format options.
 * @enum {string}
 */
export const ExportFormat = {
  PDF: 'pdf',
  CSV: 'csv'
}

/**
 * Creates a report configuration object.
 * @param {string} type - Report type from ReportType enum
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {string[]} memberIds - List of member IDs to include
 * @param {string} format - Export format from ExportFormat enum
 * @returns {Object} Report configuration object
 */
export const createReportConfig = (type, startDate, endDate, memberIds, format) => ({
  type, startDate, endDate, memberIds, format
})

/**
 * Creates a financial summary object.
 * @param {number} totalIncome - Total income amount
 * @param {number} totalExpenses - Total expenses amount
 * @returns {{ totalIncome: number, totalExpenses: number, netSavings: number }}
 */
export const createFinancialSummary = (totalIncome, totalExpenses) => ({
  totalIncome,
  totalExpenses,
  netSavings: totalIncome - totalExpenses
})
