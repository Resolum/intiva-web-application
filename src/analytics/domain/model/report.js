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
 * Report configuration value object.
 *
 * @class ReportConfig
 */
export class ReportConfig {
    /**
     * @param {string} type - Report type from ReportType enum.
     * @param {string} startDate - Start date in ISO format.
     * @param {string} endDate - End date in ISO format.
     * @param {string[]} memberIds - List of member IDs to include.
     * @param {string} format - Export format from ExportFormat enum.
     */
    constructor(type, startDate, endDate, memberIds, format) {
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.memberIds = memberIds;
        this.format = format;
    }
}

/**
 * Financial summary value object.
 *
 * @class FinancialSummary
 */
export class FinancialSummary {
    /**
     * @param {number} totalIncome - Total income amount.
     * @param {number} totalExpenses - Total expenses amount.
     * @param {number|null} netSavings - Net savings (defaults to income - expenses).
     */
    constructor(totalIncome, totalExpenses, netSavings = null) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netSavings = netSavings !== null ? netSavings : totalIncome - totalExpenses;
    }
}
