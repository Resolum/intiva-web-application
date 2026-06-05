import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Resolves a ref value to a plain HTMLElement.
 * Accepts either a direct HTMLElement ref or a Vue component ref whose $el is an HTMLElement.
 *
 * @param {import('vue').Ref} elRef
 * @returns {HTMLElement|null}
 */
function resolveEl(elRef) {
  const v = elRef?.value
  if (!v) return null
  // Plain DOM element
  if (v instanceof HTMLElement) return v
  // Vue component instance — use $el
  if (v.$el instanceof HTMLElement) return v.$el
  return null
}

/**
 * Composable that provides PNG and PDF download helpers for chart cards.
 *
 * Usage: pass a template ref that points to an HTMLElement (e.g. the .chart-card div).
 * The ref must resolve to a plain DOM element, NOT a vue-chartjs component ref.
 */
export function useChartDownload() {
  /**
   * Downloads a snapshot of the element as a PNG.
   *
   * @param {import('vue').Ref<HTMLElement>} elRef  - Ref to the container element
   * @param {string}                         filename
   */
  async function downloadAsImage(elRef, filename = 'chart') {
    const el = resolveEl(elRef)
    if (!el) {
      console.warn('useChartDownload: element not found for PNG export')
      return
    }

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(el).backgroundColor || '#141023',
      logging: false,
    })

    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  /**
   * Captures the element and downloads it as an A4 landscape PDF.
   *
   * @param {import('vue').Ref<HTMLElement>} elRef  - Ref to the container element
   * @param {string}                         filename
   */
  async function downloadAsPDF(elRef, filename = 'chart') {
    const el = resolveEl(elRef)
    if (!el) {
      console.warn('useChartDownload: element not found for PDF export')
      return
    }

    const snapshot = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(el).backgroundColor || '#141023',
      logging: false,
    })

    const imgData = snapshot.toDataURL('image/png')
    const pdf     = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageW   = pdf.internal.pageSize.getWidth()
    const pageH   = pdf.internal.pageSize.getHeight()

    const imgH = (snapshot.height * pageW) / snapshot.width
    const yPos = imgH < pageH ? (pageH - imgH) / 2 : 0

    pdf.addImage(imgData, 'PNG', 0, yPos, pageW, imgH)
    pdf.save(`${filename}.pdf`)
  }

  return { downloadAsImage, downloadAsPDF }
}
