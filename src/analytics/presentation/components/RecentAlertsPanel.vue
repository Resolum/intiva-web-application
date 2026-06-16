<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  alerts: { type: Array, required: true },
});

const { t } = useI18n();

/**
 * Resolve alert title — supports both raw strings (from API) and i18n keys.
 * An i18n key always contains a dot, e.g. 'alerts.budgetAlert'.
 */
function alertTitle(alert) {
  if (alert.titleKey?.includes('.')) return t(alert.titleKey)
  return alert.titleKey ?? alert.title ?? ''
}

/**
 * Resolve alert description — same logic as title.
 */
function alertDesc(alert) {
  if (alert.descriptionKey?.includes('.')) return t(alert.descriptionKey)
  return alert.descriptionKey ?? alert.description ?? ''
}

function isUrgent(alert) {
  return alert.type === 'budget' || alert.color === '#D85A30'
}
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ t("dashboard.recentAlerts") }}</h3>

    <div v-if="alerts.length === 0" class="empty-state">
      <i class="pi pi-bell empty-icon"></i>
      <p class="empty-text">{{ t('dashboard.noAlerts') || 'No alerts' }}</p>
    </div>

    <div v-else class="alerts-list">
      <div v-for="(alert, index) in alerts" :key="alert.id">
        <div
          class="alert-item"
          :style="{
            borderLeftColor: alert.color,
            '--alert-delay': `${index * 0.12}s`
          }"
        >
          <div
            :class="['alert-icon-circle', { urgent: isUrgent(alert) }]"
            :style="{ backgroundColor: alert.color + '20', color: alert.color }"
          >
            <i class="pi pi-exclamation-circle"></i>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alertTitle(alert) }}</div>
            <div class="alert-desc">{{ alertDesc(alert) }}</div>
          </div>
        </div>
        <div v-if="index < alerts.length - 1" class="alert-separator"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}
.chart-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 1rem;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
}
.empty-icon {
  font-size: 2.5rem;
  color: var(--text-muted);
  opacity: 0.4;
}
.empty-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
.alerts-list {
  display: flex;
  flex-direction: column;
}
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0 10px 12px;
  border-left: 3px solid transparent;
  animation: slideInRight 0.4s ease forwards;
  animation-delay: var(--alert-delay);
  opacity: 0;
  position: relative;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  transition: background 0.2s ease;
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
.alert-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(127, 119, 221, 0.06);
  border-radius: inherit;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
  pointer-events: none;
}
.alert-item:hover::before {
  transform: scaleX(1);
}
.alert-icon-circle {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.alert-icon-circle.urgent {
  animation: pulseUrgent 2s ease-in-out infinite;
}
@keyframes pulseUrgent {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
.alert-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  position: relative;
}
.alert-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.alert-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.alert-separator {
  height: 0.5px;
  background: var(--border-color);
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .alert-item { animation: none; opacity: 1; }
  .alert-item::before { display: none; }
  .alert-icon-circle.urgent { animation: none; }
}
</style>
