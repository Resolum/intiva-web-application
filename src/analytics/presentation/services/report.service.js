import { AnalyticsApi } from '@/analytics/infrastructure/analytics-api.js'
import { FinancialSummaryAssembler } from '@/analytics/infrastructure/financial-summary.assembler.js'

const analyticsApi = new AnalyticsApi()

/**
 * Presentation service for the Report feature.
 * Orchestrates report data fetching and assembly for views.
 *
 * @returns {{ getPreviewSummary: Function }} Service interface.
 */
export function useReportPresentationService() {
  /**
   * Fetches and assembles the financial report preview data.
   * @param {Object} params - Query parameters for the report.
   * @returns {Promise<{ summary: Object, chartData: Object[], transactions: Object[] }>} Preview data.
   */
  async function getPreviewSummary(params) {
    try {
      const rawData = await analyticsApi.getReportSummary(params)
      const mergedData = rawData.data ?? rawData

      return FinancialSummaryAssembler.toPreviewData(mergedData)
    } catch (error) {
      console.error('[ReportService] getPreviewSummary failed:', error)
      throw new Error('reports.errors.loadFailed')
    }
  }

  return { getPreviewSummary }
}
