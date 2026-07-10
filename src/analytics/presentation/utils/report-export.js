const ReportType = {
  GENERAL: 'general',
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
}

function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function escapeCsvValue(value) {
  if (value == null) return ''
  const stringValue = String(value)
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export function exportToCSV(report = {}, filename = 'reporte') {
  const {
    title = 'Reporte',
    reportType = ReportType.GENERAL,
    periodStart = '',
    periodEnd = '',
    members = [],
    summary = {},
    transactions = [],
    chartData = [],
  } = report

  const rows = []
  rows.push(['Reporte', title])
  rows.push(['Período', `${periodStart} - ${periodEnd}`])
  if (members.length > 0) {
    rows.push(['Miembros incluidos', members.join('; ')])
  }
  if (reportType === ReportType.GENERAL || reportType === ReportType.INCOME) {
    rows.push(['Ingreso total', formatCurrency(summary.totalIncome)])
  }
  if (reportType === ReportType.GENERAL || reportType === ReportType.EXPENSES) {
    rows.push(['Gasto total', formatCurrency(summary.totalExpenses)])
  }
  if (reportType === ReportType.GENERAL || reportType === ReportType.SAVINGS) {
    rows.push(['Ahorro neto', formatCurrency(summary.netSavings)])
  }

  if (chartData.length > 0) {
    rows.push([])
    rows.push(['Distribución de Gastos'])
    rows.push(['Categoría', 'Monto', 'Porcentaje'])
    chartData.forEach((item) => {
      rows.push([
        item.categoryKey || '',
        formatCurrency(item.amount),
        `${Number(item.percentage ?? 0).toFixed(1)}%`,
      ])
    })
  }

  rows.push([])
  rows.push(['Transacciones Principales'])
  rows.push(['Fecha', 'Descripción', 'Categoría', 'Monto'])

  transactions.forEach((transaction) => {
    rows.push([
      transaction.date || '',
      transaction.description || '',
      transaction.category || '',
      formatCurrency(transaction.amount),
    ])
  })

  const csvContent = rows
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}

export async function exportToPDF(report = {}, filename = 'reporte') {
  const {
    title = 'Reporte',
    reportType = ReportType.GENERAL,
    periodStart = '',
    periodEnd = '',
    members = [],
    summary = {},
    transactions = [],
  } = report

  const { default: jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageW - margin * 2
  let y = margin

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.text(title, margin, y)
  y += 10

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(`Período: ${periodStart} - ${periodEnd}`, margin, y)
  y += 6
  if (members.length > 0) {
    pdf.text(`Miembros incluidos: ${members.join(', ')}`, margin, y)
    y += 6
  }
  y += 4

  const showSummary =
    reportType === ReportType.GENERAL ||
    reportType === ReportType.INCOME ||
    reportType === ReportType.EXPENSES ||
    reportType === ReportType.SAVINGS

  if (showSummary) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text('Resumen financiero', margin, y)
    y += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)

    if (reportType === ReportType.GENERAL || reportType === ReportType.INCOME) {
      pdf.text(`Ingreso total: ${formatCurrency(summary.totalIncome)}`, margin, y)
      y += 6
    }
    if (reportType === ReportType.GENERAL || reportType === ReportType.EXPENSES) {
      pdf.text(`Gasto total: ${formatCurrency(summary.totalExpenses)}`, margin, y)
      y += 6
    }
    if (reportType === ReportType.GENERAL || reportType === ReportType.SAVINGS) {
      pdf.text(`Ahorro neto: ${formatCurrency(summary.netSavings)}`, margin, y)
      y += 6
    }
    y += 6
  }

  pdf.setFont('helvetica', 'bold')
  pdf.text('Transacciones', margin, y)
  y += 8

  const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto']
  const colWidths = [30, 80, 45, 30]
  const colPositions = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]]

  pdf.setFontSize(10)
  pdf.setTextColor('#333333')
  pdf.setDrawColor(180)
  pdf.setLineWidth(0.2)
  pdf.line(margin, y + 2, pageW - margin, y + 2)
  headers.forEach((header, index) => {
    pdf.text(header, colPositions[index], y)
  })
  y += 7
  pdf.line(margin, y - 3, pageW - margin, y - 3)

  pdf.setFont('helvetica', 'normal')
  const rowHeight = 6

  if (transactions.length === 0) {
    const emptyText = 'No hay transacciones disponibles para exportar.'
    const lines = pdf.splitTextToSize(emptyText, contentWidth)
    lines.forEach((line) => {
      if (y > pageH - margin) {
        pdf.addPage()
        y = margin
      }
      pdf.text(line, margin, y)
      y += 6
    })
  } else {
    transactions.forEach((transaction) => {
      const descLines = pdf.splitTextToSize(transaction.description || '', colWidths[1])
      const rowLines = Math.max(1, descLines.length)
      const totalHeight = rowLines * rowHeight
      if (y + totalHeight > pageH - margin) {
        pdf.addPage()
        y = margin
      }

      pdf.text(transaction.date || '', colPositions[0], y)
      pdf.text(descLines, colPositions[1], y)
      pdf.text(transaction.category || '', colPositions[2], y)
      pdf.text(formatCurrency(transaction.amount), colPositions[3] + colWidths[3], y, { align: 'right' })
      y += totalHeight
    })
  }

  pdf.save(`${filename}.pdf`)
}