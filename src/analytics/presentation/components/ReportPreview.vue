<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { useCountAnimation } from '@/composables/useCountAnimation.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  summary: { type: Object, default: () => ({ totalIncome: 0, totalExpenses: 0, netSavings: 0 }) },
  transactions: { type: Array, default: () => [] },
  chartData: { type: Array, default: () => [] },
  periodStart: { type: String, default: '' },
  periodEnd: { type: String, default: '' },
  generatedAt: { type: String, default: '' },
})

const { t } = useI18n()

const hasReport = computed(() => {
  return Boolean(props.periodStart)
})

const animatedIncome = useCountAnimation(computed(() => props.summary.totalIncome), 1200)
const animatedExpenses = useCountAnimation(computed(() => props.summary.totalExpenses), 1200)
const animatedSavings = useCountAnimation(computed(() => props.summary.netSavings), 1200)

const formatCurrency = (val) => {
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatCurrencyColor = (val) => {
  return val >= 0 ? '#2E7D32' : '#D32F2F'
}

const barChartData = computed(() => ({
  labels: props.chartData.map(d => d.categoryKey),
  datasets: [{
    data: props.chartData.map(d => d.amount),
    backgroundColor: props.chartData.map(d => d.color),
    borderRadius: 4
  }]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(83, 74, 183, 0.15)' } }
  }
}

const formatDate = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="report-preview-container">
    <div class="preview-header">
      <div class="preview-label">
        <i class="pi pi-eye"></i>
        {{ t('reports.preview.label') }}
      </div>
      <div class="zoom-controls">
        <i class="pi pi-search-minus"></i>
        <span>100%</span>
        <i class="pi pi-search-plus"></i>
      </div>
    </div>

    <div v-if="!hasReport" class="preview-placeholder">
      <div class="placeholder-icon">
        <i class="pi pi-chart-bar" style="font-size: 3rem; opacity: 0.4;"></i>
      </div>
      <p class="placeholder-text">{{ t('reports.preview.noData') }}</p>
    </div>

    <div v-else class="document-card">
      <div class="document-header">
        <div class="header-titles">
          <h2 class="doc-title">{{ t('reports.preview.title') }}</h2>
          <div class="doc-subtitle">
            Período: {{ formatDate(props.periodStart) }} - {{ formatDate(props.periodEnd) }}
          </div>
        </div>
        <div class="header-meta">
          <div class="corp-name">Intiva Corp</div>
          <div class="gen-date">
            {{ t('reports.preview.generatedBy') }} {{ formatDate(props.generatedAt) }}
          </div>
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="summary-cards">
        <div class="summary-card card-income" style="--flip-delay: 0s">
          <i class="pi pi-arrow-up card-icon"></i>
          <div class="sum-label">{{ t('reports.preview.totalIncome') }}</div>
          <div class="sum-value">{{ formatCurrency(animatedIncome) }}</div>
        </div>
        <div class="summary-card card-expense" style="--flip-delay: 0.1s">
          <i class="pi pi-arrow-down card-icon"></i>
          <div class="sum-label">{{ t('reports.preview.totalExpenses') }}</div>
          <div class="sum-value">{{ formatCurrency(animatedExpenses) }}</div>
        </div>
        <div class="summary-card card-savings" style="--flip-delay: 0.2s">
          <i class="pi pi-star card-icon"></i>
          <div class="sum-label">{{ t('reports.preview.netSavings') }}</div>
          <div class="sum-value">{{ formatCurrency(animatedSavings) }}</div>
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="chart-section">
        <h3 class="section-heading">
          <i class="pi pi-chart-pie"></i>
          {{ t('reports.preview.expenseChart') }}
        </h3>
        <div class="chart-wrapper">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="transactions-section">
        <h3 class="section-heading">
          <i class="pi pi-list"></i>
          {{ t('reports.preview.topTransactions') }}
        </h3>
        <table class="tx-table">
          <thead>
            <tr>
              <th>{{ t('reports.preview.columns.date') }}</th>
              <th>{{ t('reports.preview.columns.description') }}</th>
              <th>{{ t('reports.preview.columns.category') }}</th>
              <th class="right-align">{{ t('reports.preview.columns.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tx, i) in transactions"
              :key="tx.id"
              class="tx-row"
              :style="{'--row-delay': `${i * 0.05}s`}"
            >
              <td>{{ tx.date }}</td>
              <td>{{ tx.description }}</td>
              <td>{{ tx.category }}</td>
              <td class="right-align" :style="{ color: formatCurrencyColor(tx.amount) }">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Inter', sans-serif;
  min-height: 400px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.zoom-controls i {
  cursor: pointer;
  color: var(--text-muted);
}

.zoom-controls i:hover {
  color: var(--text-primary);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  flex: 1;
  opacity: 0.5;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
}

.placeholder-icon {
  font-size: 3rem;
}

.placeholder-text {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.document-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 0.5px solid var(--border-color);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  color: var(--text-primary);
  min-width: 0;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.doc-title {
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  color: var(--color-primary-light, #EAE8FF);
  margin: 0 0 0.25rem 0;
}

.doc-subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.header-meta {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.corp-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.doc-divider {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 1rem 0;
}

.summary-cards {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  padding: 1.5rem 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  animation: flipIn 0.6s ease forwards;
  animation-delay: var(--flip-delay);
  opacity: 0;
}

@keyframes flipIn {
  from {
    opacity: 0;
    transform: perspective(600px) rotateX(-30deg);
  }
  to {
    opacity: 1;
    transform: perspective(600px) rotateX(0deg);
  }
}

.card-icon {
  font-size: 1.4rem;
  opacity: 0.7;
}

.card-income {
  background: linear-gradient(135deg, rgba(29, 158, 117, 0.12), rgba(29, 158, 117, 0.04));
  border: 1px solid rgba(29, 158, 117, 0.2);
}

.card-income .card-icon,
.card-income .sum-value {
  color: var(--color-success);
}

.card-expense {
  background: linear-gradient(135deg, rgba(216, 90, 48, 0.12), rgba(216, 90, 48, 0.04));
  border: 1px solid rgba(216, 90, 48, 0.2);
}

.card-expense .card-icon,
.card-expense .sum-value {
  color: var(--color-danger);
}

.card-savings {
  background: linear-gradient(135deg, rgba(83, 74, 183, 0.15), rgba(83, 74, 183, 0.05));
  border: 1px solid rgba(83, 74, 183, 0.25);
}

.card-savings .card-icon,
.card-savings .sum-value {
  color: var(--color-primary-light);
}

.sum-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.sum-value {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.section-heading i {
  font-size: 1.1rem;
  color: var(--color-primary-light);
}

.chart-wrapper {
  height: 200px;
  width: 100%;
}

.tx-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.tx-table th,
.tx-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.tx-table th {
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

.tx-row {
  opacity: 0;
  animation: rowFadeIn 0.35s ease forwards;
  animation-delay: var(--row-delay);
  transition: background 0.2s ease;
}

@keyframes rowFadeIn {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

.tx-row:hover {
  background: var(--bg-secondary);
}

.tx-table .right-align {
  text-align: right;
  font-weight: 600;
}

.tx-table tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 767px) {
  .document-card {
    padding: 1rem;
  }
  .summary-cards {
    flex-direction: column;
    gap: 0.75rem;
  }
  .summary-card {
    padding: 1rem;
  }
  .sum-value {
    font-size: 1.4rem;
  }
  .tx-table {
    font-size: 0.75rem;
  }
  .tx-table th,
  .tx-table td {
    padding: 0.5rem 0.3rem;
  }
  .chart-wrapper {
    height: 160px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .summary-card { animation: none; opacity: 1; }
  .tx-row { animation: none; opacity: 1; }
}
</style>
