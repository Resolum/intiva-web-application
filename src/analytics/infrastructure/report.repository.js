export const reportRepository = {
  /**
   * Fetches financial summary data for the report preview.
   * @param {Object} config - Report configuration
   * @param {string} config.startDate - Start date in ISO format
   * @param {string} config.endDate - End date in ISO format
   * @param {string[]} config.memberIds - Member IDs to include
   * @returns {Promise<Object>} Financial summary with transactions and chart data
   * @throws {Error} When the API request fails
   */
  async getFinancialSummary(config) {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalIncome: 5420,
          totalExpenses: 3150,
          chartData: [
            { categoryKey: 'Casa', amount: 1200, percentage: 38, color: '#1A237E' },
            { categoryKey: 'Comida', amount: 800, percentage: 25, color: '#2E7D32' },
            { categoryKey: 'Transp.', amount: 400, percentage: 13, color: '#C5CAE9' },
            { categoryKey: 'Ocio', amount: 300, percentage: 10, color: '#795548' },
            { categoryKey: 'Salud', amount: 450, percentage: 14, color: '#C8E6C9' },
          ],
          transactions: [
            { id: 1, date: '15 Oct', description: 'Supermercado Central', category: 'Alimentación', amount: -240.50 },
            { id: 2, date: '12 Oct', description: 'Pago de Renta', category: 'Vivienda', amount: -1200.00 },
            { id: 3, date: '01 Oct', description: 'Nómina Quincenal', category: 'Ingreso', amount: 2710.00 },
          ]
        })
      }, 500)
    })
  },

  /**
   * Generates and returns a report file as a Blob.
   * @param {Object} config - Report configuration
   * @param {string} config.format - Export format (pdf | csv)
   * @returns {Promise<Blob>} File blob ready for browser download
   * @throws {Error} When report generation fails
   */
  async generateReport(config) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockContent = 'Mock file content'
        const blob = new Blob([mockContent], { 
          type: config.format === 'pdf' ? 'application/pdf' : 'text/csv' 
        })
        resolve(blob)
      }, 800)
    })
  }
}
