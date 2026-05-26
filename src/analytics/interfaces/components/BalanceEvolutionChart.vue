<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js'
import { useI18n } from 'vue-i18n'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  data:  { type: Array,  required: true },
  range: { type: String, required: true },
})

const emit = defineEmits(['range-change'])
const { t } = useI18n()

/**
 * Maps a 'YYYY-MM' string to its translated month abbreviation.
 * @param {string} monthStr - ISO month string
 * @returns {string}
 */
function monthLabel(monthStr) {
  const monthKeys = [
    'jan','feb','mar','apr','may','jun',
    'jul','aug','sep','oct','nov','dec'
  ]
  const idx = parseInt(monthStr.split('-')[1], 10) - 1
  return t(`months.${monthKeys[idx]}`)
}

const chartData = computed(() => ({
  labels: props.data.map(p => monthLabel(p.month)),
  datasets: [{
    data: props.data.map(p => p.balance),
    borderColor: '#CDEB45', // Neon green
    backgroundColor: 'rgba(205,235,69,0.15)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#CDEB45',
    pointBorderColor: '#141023',
    pointBorderWidth: 2,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: '#FFFFFF',
    pointHoverBorderColor: '#CDEB45',
  }]
}))


const chartOptions = {
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
      grid: { color: 'rgba(83,74,183,0.15)' },
      ticks: { color: '#888780', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(83,74,183,0.15)' },
      ticks: {
        color: '#888780',
        font: { size: 11 },
        callback: (v) => `S/ ${v.toLocaleString('es-PE')}`,
      },
    }
  }
}

const ranges = [
  { key: '1M', labelKey: 'timeRange.oneMonth'   },
  { key: '6M', labelKey: 'timeRange.sixMonths'  },
  { key: '1Y', labelKey: 'timeRange.oneYear'    },
]
</script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <span class="card-tag">// METRICS</span>
      <h3 class="chart-title">{{ t('dashboard.balanceEvolution') }}</h3>
      <div class="range-buttons" role="group" :aria-label="t('dashboard.balanceEvolution')">
        <button
          v-for="r in ranges"
          :key="r.key"
          :class="['range-btn', { active: range === r.key }]"
          @click="emit('range-change', r.key)"
        >
          {{ t(r.labelKey) }}
        </button>
      </div>
    </div>
    <div style="height: 220px; position: relative;">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
}

/* Neon accent top bar */
.chart-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--color-primary) 60%, var(--color-neon) 100%);
  opacity: 0.5;
}

.chart-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.card-tag {
  font-size: 0.65rem;
  font-family: 'Space Grotesk', monospace;
  color: var(--color-primary-light);
  letter-spacing: 0.08em;
  opacity: 0.7;
  margin-right: 8px;
}

.chart-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.range-buttons { display: flex; gap: 4px; }
.range-btn {
  padding: 4px 10px;
  border: 0.5px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-family: 'Space Grotesk', monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}
.range-btn:hover {
  background: rgba(83, 74, 183, 0.1);
  color: var(--text-primary);
}
.range-btn.active {
  background: rgba(205, 235, 69, 0.12);
  color: #CDEB45;
  border-color: rgba(205, 235, 69, 0.3);
  box-shadow: 0 0 8px rgba(205, 235, 69, 0.2);
}
</style>
