<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  summary: { type: Object, default: () => ({ totalIncome: 0, totalExpenses: 0, netSavings: 0 }) },
  transactions: { type: Array, default: () => [] },
  chartData: { type: Array, default: () => [] }
})

const { t } = useI18n()

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

    <div class="document-card">
      <div class="document-header">
        <div class="header-titles">
          <h2 class="doc-title">{{ t('reports.preview.title') }}</h2>
          <div class="doc-subtitle">Período: 01 Oct - 31 Oct</div>
        </div>
        <div class="header-meta">
          <div class="corp-name">Intiva Corp</div>
          <div class="gen-date">{{ t('reports.preview.generatedBy') }} 31 Oct 2023</div>
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="summary-cards">
        <div class="summary-card">
          <div class="sum-label">{{ t('reports.preview.totalIncome') }}</div>
          <div class="sum-value">{{ formatCurrency(summary.totalIncome) }}</div>
        </div>
        <div class="summary-card">
          <div class="sum-label">{{ t('reports.preview.totalExpenses') }}</div>
          <div class="sum-value">{{ formatCurrency(summary.totalExpenses) }}</div>
        </div>
        <div class="summary-card highlight">
          <div class="sum-label">{{ t('reports.preview.netSavings') }}</div>
          <div class="sum-value">{{ formatCurrency(summary.netSavings) }}</div>
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="chart-section">
        <h3 class="section-heading">{{ t('reports.preview.expenseChart') }}</h3>
        <div class="chart-wrapper">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>

      <hr class="doc-divider" />

      <div class="transactions-section">
        <h3 class="section-heading">{{ t('reports.preview.topTransactions') }}</h3>
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
            <tr v-for="tx in transactions" :key="tx.id">
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
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1rem 0;
  color: var(--text-secondary);
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.zoom-controls i {
  cursor: pointer;
  color: var(--text-muted);
}
.zoom-controls i:hover {
  color: var(--text-primary);
}

.document-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 0.5px solid var(--border-color);
  box-shadow: var(--shadow-card);
  padding: 2.5rem;
  flex: 1;
  overflow-y: auto;
  color: var(--text-primary);
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.doc-title {
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-primary-light, #EAE8FF);
  margin: 0 0 0.5rem 0;
}

.doc-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.header-meta {
  text-align: right;
  font-size: 0.85rem;
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
  margin: 1.5rem 0;
}

.summary-cards {
  display: flex;
  gap: 1.5rem;
}

.summary-card {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.summary-card.highlight {
  background: rgba(83, 74, 183, 0.15);
  border: 1px solid var(--color-primary);
}

.summary-card.highlight .sum-value {
  color: var(--color-neon, #CDEB45);
}

.sum-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.sum-value {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-heading {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.chart-wrapper {
  height: 200px;
  width: 100%;
}

.tx-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tx-table th, .tx-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.tx-table th {
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.tx-table .right-align {
  text-align: right;
}

.tx-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
