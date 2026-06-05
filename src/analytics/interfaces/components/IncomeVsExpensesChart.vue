<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js'
import { useI18n } from 'vue-i18n'
import { useChartDownload } from '@/composables/useChartDownload.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Array, required: true },
  dateRange: { type: Object, default: null },
})

const { t } = useI18n()
const { downloadAsImage, downloadAsPDF } = useChartDownload()

const chartRef = ref(null)
const showDownload = ref(false)
const containerHeight = ref(200)
const isMobile = ref(window.innerWidth < 768)

function updateHeight() {
  const w = window.innerWidth
  isMobile.value = w < 768
  if (w < 768) containerHeight.value = 200
  else if (w < 1024) containerHeight.value = 250
  else containerHeight.value = 300
}

const chartData = computed(() => ({
  labels: props.data.map(d => t(d.monthKey)),
  datasets: [
    {
      label: t('dashboard.monthlyIncome'),
      data: props.data.map(d => d.income),
      backgroundColor: '#534AB7',
      borderRadius: 4,
    },
    {
      label: t('dashboard.monthlyExpenses'),
      data: props.data.map(d => d.expense),
      backgroundColor: '#CDEB45',
      borderRadius: 4,
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` S/ ${ctx.parsed.y.toLocaleString('es-PE')}`,
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#888780',
        font: { size: isMobile.value ? 9 : 11 },
        maxRotation: 0,
        maxTicksLimit: isMobile.value ? 5 : undefined,
      },
    },
    y: {
      grid: { color: 'rgba(83,74,183,0.15)' },
      ticks: {
        color: '#888780',
        font: { size: isMobile.value ? 9 : 11 },
        callback: (v) => `S/ ${v.toLocaleString('es-PE')}`,
        maxTicksLimit: isMobile.value ? 5 : undefined,
      },
    }
  }
}))

let resizeObserver = null

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
  <div class="cyber-card">
    <div class="card-header">
      <span class="card-tag">// COMPARISON</span>
      <h3 class="chart-title">{{ t('dashboard.incomeVsExpenses') }}</h3>
      <div class="download-btn-wrap">
        <button class="download-btn" @click.stop="showDownload = !showDownload" :aria-label="t('download')">
          <i class="pi pi-download"></i>
        </button>
        <Transition name="dropdown">
          <div v-if="showDownload" class="download-dropdown">
            <button @click="downloadAsImage(chartRef, 'income-vs-expenses'); showDownload = false">
              <i class="pi pi-image"></i> Descargar PNG
            </button>
            <button @click="downloadAsPDF(chartRef, 'income-vs-expenses'); showDownload = false">
              <i class="pi pi-file"></i> Descargar PDF
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div :style="{ height: containerHeight + 'px', position: 'relative' }">
      <Bar ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
    <div class="custom-legend">
      <div class="legend-item">
        <span class="legend-box" style="background-color: #534AB7;"></span>
        <span>{{ t('dashboard.monthlyIncome') }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-box" style="background-color: #CDEB45;"></span>
        <span>{{ t('dashboard.monthlyExpenses') }}</span>
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
  justify-content: center;
  gap: 20px;
  margin-top: 1rem;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
.legend-box {
  width: 12px; height: 12px;
  border-radius: 2px;
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
