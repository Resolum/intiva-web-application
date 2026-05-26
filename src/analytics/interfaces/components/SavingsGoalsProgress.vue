<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  goals: { type: Array, required: true },
});

const { t } = useI18n();

/**
 * Calculates progress width percentage.
 * @param {number} progress - ratio 0 to 1
 * @returns {string} e.g. "45.0%"
 */
function progressWidth(progress) {
  return `${Math.min(progress * 100, 100).toFixed(1)}%`;
}

/**
 * Formats value to PEN currency.
 * @param {number} val
 * @returns {string}
 */
function fmt(val) {
  return `S/ ${val.toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;
}
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ t("dashboard.savingsGoalsProgress") }}</h3>

    <div class="goals-list">
      <div v-for="goal in goals" :key="goal.goalKey" class="goal-item">
        <div class="goal-header">
          <span class="goal-name">{{ t(goal.goalKey) }}</span>
          <span class="goal-amounts"
            >{{ fmt(goal.saved) }} / {{ fmt(goal.target) }}</span
          >
        </div>
        <div class="progress-bg">
          <div
            class="progress-fill"
            :style="{ width: progressWidth(goal.progress) }"
          ></div>
        </div>
      </div>
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
}
.chart-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 1.25rem;
}
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.goal-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.goal-amounts {
  font-size: 12px;
  color: var(--text-muted);
}
.progress-bg {
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.6s ease;
}
</style>
