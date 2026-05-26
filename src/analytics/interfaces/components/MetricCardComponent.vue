<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  card: { type: Object, required: true },
});

const { t } = useI18n();

/**
 * Formats a numeric value as PEN currency string.
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return value.toLocaleString("es-PE", { minimumFractionDigits: 0 });
}
const isPositive = computed(() => props.card.trend >= 0);
const trendLabel = computed(() => {
  const abs = Math.abs(props.card.trend).toFixed(1);
  return isPositive.value ? `↑ +${abs}%` : `↓ ${abs}%`;
});
</script>

<template>
  <div class="metric-card">
    <div class="metric-header">
      <span class="metric-label">{{ t(card.labelKey) }}</span>
      <div class="metric-icon" aria-hidden="true">
        <i :class="`pi pi-${card.icon}`"></i>
      </div>
    </div>
    <div class="metric-value">S/ {{ formatCurrency(card.value) }}</div>
    <div :class="['metric-trend', isPositive ? 'up' : 'down']">
      {{ trendLabel }}
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-card);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.metric-card:hover {
  transform: translateY(-2px);
}
.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.metric-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 500;
}
.metric-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--color-primary);
}
.metric-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}
.metric-trend {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  width: fit-content;
}
.metric-trend.up {
  background: rgba(205, 235, 69, 0.15);
  color: #8a9200;
}
.metric-trend.down {
  background: rgba(216, 90, 48, 0.12);
  color: var(--color-danger);
}

[data-theme="dark"] .metric-trend.up {
  color: #cdeb45;
}
</style>
