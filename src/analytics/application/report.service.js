import { reportRepository } from '../infrastructure/report.repository.js'
import { createFinancialSummary } from '../domain/model/report.js'

export const useReportService = () => {
  /**
   * Loads the financial summary preview for the given configuration.
   * @param {Object} config - Report configuration object
   * @returns {Promise<Object>} Summary with income, expenses, savings and transactions
   * @throws {Error} When config is invalid or API call fails
   */
  const getPreviewSummary = async (config) => {
    try {
      const data = await reportRepository.getFinancialSummary(config)
      const summary = createFinancialSummary(data.totalIncome, data.totalExpenses)
      
      return {
        summary,
        chartData: data.chartData,
        transactions: data.transactions
      }
    } catch (error) {
      console.error('Failed to get report preview:', error)
      throw new Error('reports.errors.loadFailed')
    }
  }

  /**
   * Triggers the browser download of a generated report file.
   * @param {Object} config - Report configuration object
   * @param {string} config.format - 'pdf' or 'csv'
   * @returns {Promise<void>} Resolves when download starts
   * @throws {Error} When generation or download fails
   */
  const downloadReport = async (config) => {
    try {
      const blob = await reportRepository.generateReport(config)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report-${config.startDate}-to-${config.endDate}.${config.format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate report:', error)
      throw new Error('reports.errors.generateFailed')
    }
  }

  return {
    getPreviewSummary,
    downloadReport
  }
}
