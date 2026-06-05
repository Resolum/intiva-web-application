import { reportRepository } from '../infrastructure/report.repository.js'
import { createFinancialSummary } from '../domain/model/report.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

  /**
   * Exports transaction data as a CSV file.
   * @param {Array} transactions - Array of transaction objects
   * @param {string} filename - Output filename without extension
   */
  const exportToCSV = (transactions, filename = 'reporte') => {
    const headers = ['Fecha', 'Descripci\u00F3n', 'Categor\u00EDa', 'Monto']
    const rows = transactions.map(t => [
      t.date, t.description, t.category, t.amount
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  /**
   * Captures the report preview DOM element and exports it as a real PDF file.
   * Uses html2canvas to render the element and jsPDF to produce the binary.
   *
   * @param {string} filename - Output filename without extension
   * @returns {Promise<void>}
   */
  const exportToPDF = async (filename = 'reporte') => {
    const previewEl = document.querySelector('.document-card')
    if (!previewEl) {
      console.error('exportToPDF: .document-card element not found in DOM')
      return
    }

    const canvas = await html2canvas(previewEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(previewEl).backgroundColor || '#141023',
      logging: false,
    })

    const imgData   = canvas.toDataURL('image/png')
    const pdf       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW     = pdf.internal.pageSize.getWidth()
    const pageH     = pdf.internal.pageSize.getHeight()

    const imgW      = pageW
    const imgH      = (canvas.height * pageW) / canvas.width
    let   yOffset   = 0

    while (yOffset < imgH) {
      if (yOffset > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -yOffset, imgW, imgH)
      yOffset += pageH
    }

    pdf.save(`${filename}.pdf`)
  }

  return {
    getPreviewSummary,
    downloadReport,
    exportToCSV,
    exportToPDF,
  }
}
