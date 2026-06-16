<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useI18n } from 'vue-i18n'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Array, required: true },
  dateRange: { type: Object, default: null },
})

const { t } = useI18n()

const chartRef     = ref(null)
const cardRef      = ref(null)
const showDownload = ref(false)
const containerHeight = ref(200)
const isMobile = ref(window.innerWidth < 768)

function updateHeight() {
  const w = window.innerWidth
  isMobile.value = w < 768
  if (w < 768) containerHeight.value = 200
  else if (w < 1024) containerHeight.value = 250
  else containerHeight.value = 220
}


function catLabel(item) {
  return item.categoryKey?.includes('.') ? t(item.categoryKey) : item.categoryKey
}

const totalAmount = computed(() => {
  return props.data.reduce((acc, curr) => acc + curr.amount, 0)
})

const formattedTotal = computed(() => {
  return `S/ ${totalAmount.value.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`
})

const centerTextPlugin = {
  id: 'centerTextPlugin',
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart
    ctx.restore()
    ctx.font = '500 12px Inter, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#888780'
    const text1 = t('dashboard.total')
    const text1X = Math.round((width - ctx.measureText(text1).width) / 2)
    const text1Y = height / 2 - 10
    ctx.fillText(text1, text1X, text1Y)

    ctx.font = '600 18px Inter, sans-serif'
    ctx.fillStyle = '#EAE8FF'
    const text2 = formattedTotal.value
    const text2X = Math.round((width - ctx.measureText(text2).width) / 2)
    const text2Y = height / 2 + 10
    ctx.fillText(text2, text2X, text2Y)

    ctx.save()
  }
}

const chartData = computed(() => ({
  labels: props.data.map(d => catLabel(d)),
  datasets: [{
    data: props.data.map(d => d.amount),
    backgroundColor: props.data.map(d => d.color),
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: isMobile.value ? '55%' : '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` S/ ${ctx.parsed.toLocaleString('es-PE')}`,
      }
    }
  }
}))

let resizeObserver = null

async function captureCard() {
  const el = cardRef.value
  if (!el) return null
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: getComputedStyle(el).backgroundColor || '#141023',
    logging: false,
  })
}

async function handleDownloadPNG() {
  showDownload.value = false
  await new Promise(r => setTimeout(r, 50))
  const canvas = await captureCard()
  if (!canvas) return
  const link = document.createElement('a')
  link.download = 'expenses-category.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

async function handleDownloadPDF() {
  showDownload.value = false
  await new Promise(r => setTimeout(r, 50))
  const canvas = await captureCard()
  if (!canvas) return
  const imgData = canvas.toDataURL('image/png')
  const pdf   = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const imgH  = (canvas.height * pageW) / canvas.width
  const yPos  = imgH < pageH ? (pageH - imgH) / 2 : 0
  pdf.addImage(imgData, 'PNG', 0, yPos, pageW, imgH)
  pdf.save('expenses-category.pdf')
}

function onDocClick(e) {
  if (!e.target.closest('.download-btn-wrap')) {
    showDownload.value = false
  }
}

onMounted(() => {
  updateHeight()
  resizeObserver = new ResizeObserver(() => updateHeight())
  resizeObserver.observe(document.body)
  document.addEventListener('click', onDocClick, true)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
  document.removeEventListener('click', onDocClick, true)
})
</script>

<template>
  <div class="cyber-card" ref="cardRef">
    <div class="card-header">
      <span class="card-tag">// BREAKDOWN</span>
      <h3 class="chart-title">{{ t('dashboard.expensesByCategory') }}</h3>
      <div class="download-btn-wrap">
        <button class="download-btn" @click.stop="showDownload = !showDownload" :aria-label="t('download')">
          <i class="pi pi-download"></i>
        </button>
        <Transition name="dropdown">
          <div v-if="showDownload" class="download-dropdown">
            <button @click.stop="handleDownloadPNG">
              <i class="pi pi-image"></i> Descargar PNG
            </button>
            <button @click.stop="handleDownloadPDF">
              <i class="pi pi-file"></i> Descargar PDF
            </button>
          </div>
        </Transition>
      </div>
    </div>
    <div :style="{ height: containerHeight + 'px', position: 'relative', marginBottom: '1rem' }">
      <Doughnut ref="chartRef" :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
    </div>
    <div class="custom-legend">
      <div v-for="item in data" :key="item.categoryKey" class="legend-item">
        <div class="legend-label">
          <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
          <span>{{ catLabel(item) }}</span>
        </div>
        <div class="legend-dots"></div>
        <span class="legend-percent">{{ item.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cyber-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 0;
}

/* Neon accent top bar */
.cyber-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, var(--color-neon) 100%);
  opacity: 0.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.card-tag {
  font-size: 0.65rem;
  font-family: 'Space Grotesk', monospace;
  color: var(--color-primary-light);
  letter-spacing: 0.08em;
  opacity: 0.6;
  white-space: nowrap;
}

.chart-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
}
.legend-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.legend-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}
.legend-dots {
  flex: 1;
  border-bottom: 1px dotted var(--border-color);
  margin: 0 8px;
  position: relative;
  top: -3px;
}
.legend-percent {
  font-weight: 500;
  color: var(--text-primary);
}

.download-btn-wrap {
  position: relative;
  margin-left: 0.5rem;
}
.download-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0.5px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}
.download-btn:hover {
  background: rgba(83, 74, 183, 0.1);
  color: var(--text-primary);
}
.download-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  min-width: 180px;
  z-index: 50;
  overflow: hidden;
}
.download-dropdown button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.download-dropdown button:hover {
  background: rgba(83, 74, 183, 0.08);
  color: var(--text-primary);
}
.download-dropdown button i {
  font-size: 14px;
  width: 16px;
  color: var(--text-muted);
}

.dropdown-enter-active {
  animation: dropIn 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dropdown-leave-active {
  animation: dropOut 0.1s ease both;
}
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dropOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-3px) scale(0.97); }
}
</style>
