<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCountAnimation } from "@/composables/useCountAnimation.js";

const props = defineProps({
  card: { type: Object, required: true },
});

const { t } = useI18n();

function formatCurrency(value) {
  return value.toLocaleString("es-PE", { minimumFractionDigits: 0 });
}

const animatedValue = useCountAnimation(computed(() => props.card.value));

const isPositive = computed(() => props.card.trend >= 0);
const isUrgent = computed(() => props.card.trend < 0);

const trendLabel = computed(() => {
  const abs = Math.abs(props.card.trend).toFixed(1);
  return `${abs}%`;
});
</script>

<template>
  <div
    class="metric-card"
    :style="{ '--card-delay': '0s' }"
  >
    <div class="metric-icon-wrap">
      <i :class="`pi pi-${card.icon}`" aria-hidden="true"></i>
    </div>
    <div class="metric-body">
      <span class="metric-label">{{ t(card.labelKey) }}</span>
      <div class="metric-value">S/ {{ formatCurrency(animatedValue) }}</div>
      <div :class="['metric-trend', isPositive ? 'up' : 'down', { pulse: isUrgent }]">
        <i :class="isPositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
        {{ trendLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideUpFade 0.5s ease forwards;
  animation-delay: var(--card-delay);
  will-change: transform;
  width: 100%;
  min-width: 0;
}
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.metric-card:hover {
  transform: scale(1.03);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.65),
    0 0 0 0.5px rgba(83, 74, 183, 0.4),
    inset 0 1px 0 rgba(127, 119, 221, 0.15);
}
.metric-card:hover .metric-icon-wrap i {
  transform: rotate(5deg);
}
.metric-icon-wrap {
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-primary);
}
.metric-icon-wrap i {
  transition: transform 0.3s ease;
}
.metric-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.metric-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 500;
  white-space: normal;
  line-height: 1.2;
  opacity: 0.7;
}
.metric-value {
  font-size: clamp(1.2rem, 6vw, 1.8rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  width: fit-content;
}
.metric-trend.up {
  background: rgba(205, 235, 69, 0.15);
  color: #cdeb45;
}
.metric-trend.down {
  background: rgba(216, 90, 48, 0.12);
  color: var(--color-danger);
}
.metric-trend.pulse {
  animation: pulseBadge 0.6s ease 0.5s 1;
}
@keyframes pulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
[data-theme="light"] .metric-trend.up {
  color: #6a7a00;
}

@media (max-width: 767px) {
  .metric-icon-wrap {
    width: 32px;
    height: 32px;
    min-width: 32px;
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .metric-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .metric-card:hover {
    transform: none;
  }
}
</style>
