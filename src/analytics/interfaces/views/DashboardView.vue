<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/iam/login/application/auth.store.js";
import { useAnalyticsApplicationService } from "@/analytics/application/analytics.service.js";
import { usePeriodFilter } from "@/composables/usePeriodFilter.js";

import AppLayout from "@/shared/components/AppLayout.vue";
import MetricCardComponent from "@/analytics/interfaces/components/MetricCardComponent.vue";
import BalanceEvolutionChart from "@/analytics/interfaces/components/BalanceEvolutionChart.vue";
import ExpensesByCategoryChart from "@/analytics/interfaces/components/ExpensesByCategoryChart.vue";
import IncomeVsExpensesChart from "@/analytics/interfaces/components/IncomeVsExpensesChart.vue";
import SavingsGoalsProgress from "@/analytics/interfaces/components/SavingsGoalsProgress.vue";
import RecentAlertsPanel from "@/analytics/interfaces/components/RecentAlertsPanel.vue";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const service = useAnalyticsApplicationService();

const { selectedPeriod, customFrom, customTo, dateRange } = usePeriodFilter();

const metricCards = service.getMetricCards();
const categoryData = service.getCategoryExpenses();
const incomeVsData = service.getIncomeVsExpenses();
const savingsGoals = service.getSavingsGoals();
const recentAlerts = service.getRecentAlerts();

const activeRange = computed(() => {
  if (selectedPeriod.value === 'Personalizado') return '6M'
  if (selectedPeriod.value === '1A') return '1Y'
  return selectedPeriod.value
})

const balancePoints = computed(() =>
  service.getBalanceEvolution(activeRange.value),
);

function onLogout() {
  authStore.clearAuth();
  router.push('/sign-in');
}
</script>

<template>
  <AppLayout
    :page-title="t('dashboard.title')"
    :alert-count="recentAlerts.length"
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

      <div class="metrics-grid">
        <MetricCardComponent
          v-for="card in metricCards"
          :key="card.labelKey"
          :card="card"
        />
      </div>
      <div style="margin-bottom: 1rem">
        <BalanceEvolutionChart
          :data="balancePoints"
          :range="activeRange"
        />
      </div>
      <div class="charts-row">
        <ExpensesByCategoryChart :data="categoryData" :date-range="dateRange" />
        <IncomeVsExpensesChart :data="incomeVsData" :date-range="dateRange" />
      </div>
      <div class="bottom-row">
        <SavingsGoalsProgress :goals="savingsGoals" />
        <RecentAlertsPanel :alerts="recentAlerts" />
      </div>
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
.custom-range input {
  flex: 1;
  min-width: 120px;
  font-size: 0.75rem;
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
.date-sep {
  color: var(--text-muted);
  font-size: 0.85rem;
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
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-body {
    padding: 1.5rem 2rem 2rem;
  }
  .period-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .charts-row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  }
  .bottom-row {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .dashboard-body {
    padding: 0.75rem;
  }
  .period-filter {
    gap: 0.35rem;
    margin-bottom: 0.75rem;
  }
  .period-btn {
    padding: 0.2rem 0.55rem;
    font-size: 0.72rem;
    min-width: unset;
  }
  .custom-range input {
    min-width: 100px;
  }
}
</style>
