<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js'
import { useI18n } from 'vue-i18n'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Array, required: true },
})

const { t } = useI18n()

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
      grid: { display: false },
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
</script>

<template>
  <div class="cyber-card">
    <div class="card-header">
      <span class="card-tag">// COMPARISON</span>
      <h3 class="chart-title">{{ t('dashboard.incomeVsExpenses') }}</h3>
    </div>
    
    <div style="height: 220px; position: relative;">
      <Bar :data="chartData" :options="chartOptions" />
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
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
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
</style>
