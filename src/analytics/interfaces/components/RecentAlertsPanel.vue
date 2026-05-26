<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  alerts: { type: Array, required: true },
});

const { t } = useI18n();
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ t("dashboard.recentAlerts") }}</h3>

    <div class="alerts-list">
      <div v-for="(alert, index) in alerts" :key="alert.id">
        <div class="alert-item">
          <div
            class="alert-bubble"
            :style="{ backgroundColor: alert.color + '26', color: alert.color }"
          >
            <i :class="`ti ti-${alert.icon}`"></i>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ t(alert.titleKey) }}</div>
            <div class="alert-desc">{{ t(alert.descriptionKey) }}</div>
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
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-card);
}
.chart-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 1rem;
}
.alerts-list {
  display: flex;
  flex-direction: column;
}
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}
.alert-bubble {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.alert-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.alert-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.alert-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}
.alert-separator {
  height: 0.5px;
  background: var(--border-color);
  margin: 4px 0;
}
</style>
