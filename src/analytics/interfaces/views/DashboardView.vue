<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/iam/login/application/auth.store.js";
import { useAnalyticsApplicationService } from "@/analytics/application/analytics.service.js";

import AppSidebar from "@/shared/components/AppSidebar.vue";
import AppHeader from "@/shared/components/AppHeader.vue";
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
const activeRange = ref("6M");

const metricCards = service.getMetricCards();
const categoryData = service.getCategoryExpenses();
const incomeVsData = service.getIncomeVsExpenses();
const savingsGoals = service.getSavingsGoals();
const recentAlerts = service.getRecentAlerts();

/**
 * Balance evolution points filtered by activeRange.
 * Recomputed whenever activeRange changes.
 */
const balancePoints = computed(() =>
  service.getBalanceEvolution(activeRange.value),
);

/**
 * Updates the active time range.
 * @param {string} range - '1M' | '6M' | '1Y'
 */
function onRangeChange(range) {
  activeRange.value = range;
}

/**
 * Handles user logout.
 */
function onLogout() {
  authStore.clearAuth();
  router.push('/sign-in');
}
</script>

<template>
  <div class="app-layout">
    <AppSidebar @logout="onLogout" />
    <div class="main-content">
      <AppHeader
        :page-title="t('dashboard.title')"
        :alert-count="recentAlerts.length"
      />

      <main class="page-body">
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
            @range-change="onRangeChange"
          />
        </div>
        <div class="charts-row">
          <ExpensesByCategoryChart :data="categoryData" />
          <IncomeVsExpensesChart :data="incomeVsData" />
        </div>
        <div class="bottom-row">
          <SavingsGoalsProgress :goals="savingsGoals" />
          <RecentAlertsPanel :alerts="recentAlerts" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 3;
  isolation: isolate;
  background: var(--bg-primary);
  font-family: "Inter", system-ui, sans-serif;
}
.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  min-height: 100vh;
  width: calc(100% - var(--sidebar-width));
  box-sizing: border-box;
}
.page-body {
  padding: 1.5rem 2rem 2rem;
  flex: 1;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.charts-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 1rem;
  margin-bottom: 1rem;
}
.bottom-row {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
</style>
