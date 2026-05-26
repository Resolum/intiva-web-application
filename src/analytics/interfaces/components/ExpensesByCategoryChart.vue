<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useI18n } from 'vue-i18n'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Array, required: true },
})

const { t } = useI18n()
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

    // Draw amount
    ctx.font = '600 18px Inter, sans-serif'
    // In cyberpunk theme, make the center text neon or white
    ctx.fillStyle = '#EAE8FF'
    const text2 = formattedTotal.value
    const text2X = Math.round((width - ctx.measureText(text2).width) / 2)
    const text2Y = height / 2 + 10
    ctx.fillText(text2, text2X, text2Y)
    
    ctx.save()
  }
}

const chartData = computed(() => ({
  labels: props.data.map(d => t(d.categoryKey)),
  datasets: [{
    data: props.data.map(d => d.amount),
    backgroundColor: props.data.map(d => d.color),
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` S/ ${ctx.parsed.toLocaleString('es-PE')}`,
      }
    }
  }
}
</script>

<template>
  <div class="cyber-card">
    <div class="card-header">
      <span class="card-tag">// BREAKDOWN</span>
      <h3 class="chart-title">{{ t('dashboard.expensesByCategory') }}</h3>
    </div>
    <div style="height: 180px; position: relative; margin-bottom: 1rem;">
      <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
    </div>
    <div class="custom-legend">
      <div v-for="item in data" :key="item.categoryKey" class="legend-item">
        <div class="legend-label">
          <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
          <span>{{ t(item.categoryKey) }}</span>
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
</style>
