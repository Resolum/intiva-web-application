<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  goals: { type: Array, required: true },
});

const { t } = useI18n();

const CIRCUMFERENCE = 2 * Math.PI * 38;

const animatedOffsets = ref({})

onMounted(() => {
  props.goals.forEach((goal, i) => {
    setTimeout(() => {
      animatedOffsets.value = {
        ...animatedOffsets.value,
        [goal.goalKey]: CIRCUMFERENCE * (1 - Math.min(goal.progress, 1))
      }
    }, 300 + i * 300)
  })
})

function progressColor(pct) {
  const v = Math.min(pct, 1)
  if (v >= 1) return "#8b5cf6"
  if (v > 0.8) return "#22c55e"
  if (v >= 0.5) return "#f59e0b"
  return "#ef4444"
}

function progressWidth(progress) {
  return `${Math.min(progress * 100, 100).toFixed(1)}%`
}

function fmt(val) {
  return `S/ ${val.toLocaleString("es-PE", { minimumFractionDigits: 0 })}`
}

function isComplete(goal) {
  return goal.progress >= 1
}
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ t("dashboard.savingsGoalsProgress") }}</h3>

    <div class="goals-list">
      <div
        v-for="(goal, i) in goals"
        :key="goal.goalKey"
        class="goal-item"
        :style="{ '--goal-delay': `${i * 0.3}s` }"
      >
        <div class="goal-donut-wrap">
          <svg viewBox="0 0 100 100" class="donut-ring">
            <circle
              cx="50" cy="50" r="38"
              fill="none"
              stroke="var(--bg-secondary)"
              stroke-width="8"
            />
            <circle
              cx="50" cy="50" r="38"
              fill="none"
              :stroke="progressColor(goal.progress)"
              stroke-width="8"
              :stroke-dasharray="CIRCUMFERENCE"
              :stroke-dashoffset="animatedOffsets[goal.goalKey] ?? CIRCUMFERENCE"
              transform="rotate(-90, 50, 50)"
              stroke-linecap="round"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease;"
            />
            <template v-if="isComplete(goal)">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" stroke-width="8" />
              <path
                d="M35 50 L46 61 L65 39"
                fill="none"
                stroke="#8b5cf6"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="checkmark-path"
              />
            </template>
            <text
              v-else
              x="50" y="50"
              text-anchor="middle"
              dominant-baseline="central"
              :fill="progressColor(goal.progress)"
              font-size="18"
              font-weight="700"
              font-family="'Inter', sans-serif"
              class="donut-text"
            >
              {{ (goal.progress * 100).toFixed(0) }}%
            </text>
          </svg>
        </div>
        <div class="goal-body">
          <div class="goal-name">{{ t(goal.goalKey) }}</div>
          <div class="goal-amounts">
            <span class="goal-saved">{{ fmt(goal.saved) }}</span>
            <span class="goal-target">{{ fmt(goal.target) }}</span>
          </div>
          <div class="progress-bg">
            <div
              class="progress-fill"
              :style="{
                width: progressWidth(goal.progress),
                background: progressColor(goal.progress)
              }"
            ></div>
          </div>
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
  padding: 1.5rem;
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
.goal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: fadeInGoal 0.5s ease forwards;
  animation-delay: var(--goal-delay);
  opacity: 0;
}
@keyframes fadeInGoal {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.goal-donut-wrap {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}
.donut-ring {
  width: 100%;
  height: 100%;
}
.checkmark-path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: drawCheck 0.6s ease forwards;
  animation-delay: 0.2s;
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}
.donut-text {
  animation: fadeInText 0.3s ease forwards;
}
@keyframes fadeInText {
  from { opacity: 0; }
  to { opacity: 1; }
}
.goal-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.goal-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goal-amounts {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.goal-saved {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.goal-target {
  font-size: 0.75rem;
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
  border-radius: 3px;
  transition: width 0.6s ease, background 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
  .goal-item { animation: none; opacity: 1; }
  .progress-fill { transition: none; }
  .checkmark-path { animation: none; stroke-dashoffset: 0; }
  .donut-text { animation: none; }
}
</style>
