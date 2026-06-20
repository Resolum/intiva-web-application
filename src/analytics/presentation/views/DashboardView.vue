<script setup>
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { useDashboardStore } from '@/analytics/application/dashboard.store.js'
import { usePeriodFilter } from '@/composables/usePeriodFilter.js'

import AppLayout from '@/shared/presentation/components/AppLayout.vue'
import MetricCardComponent from '@/analytics/presentation/components/MetricCardComponent.vue'
import BalanceEvolutionChart from '@/analytics/presentation/components/BalanceEvolutionChart.vue'
import ExpensesByCategoryChart from '@/analytics/presentation/components/ExpensesByCategoryChart.vue'
import IncomeVsExpensesChart from '@/analytics/presentation/components/IncomeVsExpensesChart.vue'
import SavingsGoalsProgress from '@/analytics/presentation/components/SavingsGoalsProgress.vue'
import RecentAlertsPanel from '@/analytics/presentation/components/RecentAlertsPanel.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const dashboard = useDashboardStore()

const { selectedPeriod, customFrom, customTo, dateRange } = usePeriodFilter()

function buildParams() {
  const PERIOD_MONTHS = { '1M': 1, '3M': 3, '6M': 6, '1A': 12 }
  const lastN = PERIOD_MONTHS[selectedPeriod.value] ?? 6

  return {
    periodType:   'MONTHLY',
    periodStart:  dateRange.value.from,
    periodEnd:    dateRange.value.to,
    lastNPeriods: lastN,
  }
}

function activeRange() {
  if (selectedPeriod.value === '1A') return '1Y'
  if (selectedPeriod.value === 'Personalizado') return '6M'
  return selectedPeriod.value
}

onMounted(() => dashboard.fetch(authStore.user?.userId, buildParams()))

watch(selectedPeriod, (val) => {
  if (val === 'Personalizado') return
  dashboard.fetch(authStore.user?.userId, buildParams())
})

watch([customFrom, customTo], () => {
  if (!customFrom.value || !customTo.value) return
  dashboard.fetch(authStore.user?.userId, buildParams())
})

function onLogout() {
  dashboard.reset()
  authStore.signOut()
  router.push('/sign-in')
}
</script>

<template>
  <AppLayout
    :page-title="t('dashboard.title')"
    :alert-count="dashboard.alerts.length"
    @logout="onLogout"
  >
    <div class="dashboard-body">

      <div class="period-filter">
        <button
          v-for="p in ['1M','3M','6M','1A','Personalizado']"
          :key="p"
          :class="['period-btn', { active: selectedPeriod === p }]"
          @click="selectedPeriod = p"
        >{{ p }}</button>
        <div v-if="selectedPeriod === 'Personalizado'" class="custom-range">
          <input type="date" class="date-input" v-model="customFrom" />
          <span class="date-sep">→</span>
          <input type="date" class="date-input" v-model="customTo" />
        </div>
      </div>

      <div v-if="dashboard.isLoading && !dashboard.hasData" class="loading-overlay">
        <i class="pi pi-spin pi-spinner loading-spinner"></i>
        <span>{{ t('dashboard.loading') }}</span>
      </div>

      <div v-else-if="dashboard.error" class="error-banner">
        <i class="pi pi-exclamation-triangle"></i>
        {{ t('dashboard.errorLoading') }}
      </div>

      <template v-else>
        <div class="metrics-grid">
          <MetricCardComponent
            v-for="card in dashboard.metricCards"
            :key="card.labelKey"
            :card="card"
          />
        </div>

        <div style="margin-bottom: 1rem">
          <BalanceEvolutionChart
            :data="dashboard.balancePoints"
            :range="activeRange()"
          />
        </div>

        <div class="charts-row">
          <ExpensesByCategoryChart
            :data="dashboard.categoryExpenses"
            :date-range="dateRange"
          />
          <IncomeVsExpensesChart
            :data="dashboard.incomeVsExpenses"
            :date-range="dateRange"
          />
        </div>

        <div class="bottom-row">
          <SavingsGoalsProgress :goals="dashboard.savingsGoals" />
          <RecentAlertsPanel    :alerts="dashboard.alerts" />
        </div>
      </template>

    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard-body {
  padding: 1.5rem 2rem 2rem;
  overflow-x: hidden;
  max-width: 100%;
}

.period-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.period-btn {
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  color: var(--text-secondary);
  white-space: nowrap;
}
.period-btn:hover {
  background: rgba(83, 74, 183, 0.1);
  color: var(--text-primary);
}
.period-btn.active {
  background: var(--color-secondary);
  color: var(--bg-primary);
  border-color: var(--color-secondary);
  font-weight: 600;
}
.custom-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: wrap;
}
.date-input {
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.75rem;
}
.date-sep { color: var(--text-muted); font-size: 0.85rem; }

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 300px;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.loading-spinner { font-size: 2rem; color: var(--color-primary-light); }

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(216, 90, 48, 0.08);
  border: 1px solid rgba(216, 90, 48, 0.25);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.charts-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}
.bottom-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .dashboard-body { padding: 1.5rem 2rem 2rem; }
  .period-btn { padding: 0.3rem 0.8rem; font-size: 0.8rem; }
  .metrics-grid { grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .charts-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); }
  .bottom-row { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .dashboard-body { padding: 0.75rem; }
  .period-filter { gap: 0.35rem; margin-bottom: 0.75rem; }
  .period-btn { padding: 0.2rem 0.55rem; font-size: 0.72rem; }
}
</style>
