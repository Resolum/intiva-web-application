<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['logout'])
const route = useRoute()
const { t } = useI18n()

const navItems = [
  { labelKey: 'nav.dashboard', icon: 'th-large',  path: '/analytics/dashboard' },
  { labelKey: 'nav.reports',   icon: 'chart-bar', path: '/analytics/reports'   },
]

const activeIndex = computed(() => {
  const idx = navItems.findIndex(item => route.path === item.path)
  return idx >= 0 ? idx : 0
})

const indicatorStyle = ref({})

function updateIndicator() {
  const nav = document.querySelector('.nav-items')
  if (!nav) return
  const items = nav.querySelectorAll('.nav-item')
  const active = items[activeIndex.value]
  if (!active) return

  const navRect = nav.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()

  indicatorStyle.value = {
    transform: `translateY(${activeRect.top - navRect.top}px)`,
    height: `${activeRect.height}px`
  }
}

watch(activeIndex, () => {
  requestAnimationFrame(updateIndicator)
})

import { onMounted } from 'vue'
onMounted(() => {
  requestAnimationFrame(updateIndicator)
})

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark" aria-hidden="true">IN</div>
      <div>
        <p class="logo-name">{{ t('app.name') }}</p>
        <p class="logo-sub">{{ t('app.subtitle') }}</p>
      </div>
    </div>
    <nav class="sidebar-nav" role="navigation" :aria-label="t('nav.dashboard')">
      <div class="nav-label">{{ t('nav.dashboard') }}</div>
      <div class="nav-items">
        <div class="nav-indicator" :style="indicatorStyle"></div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: isActive(item.path) }]"
        >
          <i :class="`pi pi-${item.icon}`" aria-hidden="true"></i>
          <span>{{ t(item.labelKey) }}</span>
        </router-link>
      </div>
    </nav>
    <div class="sidebar-footer">
      <button class="logout-btn" @click="emit('logout')">
        <i class="pi pi-sign-out" aria-hidden="true"></i>
        {{ t('logout') }}
      </button>
    </div>
  </aside>

  <nav class="bottom-nav" role="navigation" :aria-label="t('nav.dashboard')">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      :class="['bottom-nav-item', { active: isActive(item.path) }]"
    >
      <i :class="`pi pi-${item.icon}`" aria-hidden="true"></i>
    </router-link>
  </nav>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #1A1730;
  border-right: 0.5px solid rgba(127, 119, 221, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 20;
}
.sidebar-logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 1rem;
  border-bottom: 0.5px solid rgba(127, 119, 221, 0.1);
}
.logo-mark {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.logo-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #EAE8FF;
}
.logo-sub {
  margin: 0;
  font-size: 10px;
  color: #6B6890;
}
.sidebar-nav {
  flex: 1;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 2px;
}
.nav-items {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-label {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(200, 197, 232, 0.3);
  padding: 0.75rem 0.75rem 0.5rem;
  user-select: none;
}
.nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(205, 235, 69, 0.1);
  border-radius: var(--radius-md);
  border-left: 3px solid #CDEB45;
  transition: transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1), height 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  pointer-events: none;
  z-index: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: var(--radius-md);
  color: #8B88A8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease, color 0.25s ease, padding-left 0.2s ease;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.nav-item:hover {
  color: #C8C5E8;
}
.nav-item:hover i {
  transform: scale(1.15);
  color: #EAE8FF;
}
.nav-item i {
  font-size: 1.2rem;
  width: 1.2rem;
  text-align: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease;
  will-change: transform;
  color: #6B6890;
}
.nav-item.active {
  color: #CDEB45;
}
.nav-item.active i {
  color: #CDEB45;
  animation: iconGlow 2s ease-in-out infinite;
}
@keyframes iconGlow {
  0%, 100% { filter: drop-shadow(0 0 0 rgba(205, 235, 69, 0)); }
  50% { filter: drop-shadow(0 0 4px rgba(205, 235, 69, 0.4)); }
}
.nav-item:not(.active):hover {
  background: rgba(127, 119, 221, 0.06);
  padding-left: 16px;
}
.sidebar-footer {
  margin-top: auto;
  padding: 1rem 0.75rem;
  border-top: 0.5px solid rgba(127, 119, 221, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: rgba(200, 197, 232, 0.4);
  font-size: 12px;
  font-weight: 500;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, gap 0.2s ease;
  width: 100%;
  text-align: left;
}
.logout-btn:hover {
  color: var(--color-danger);
  background: rgba(216, 90, 48, 0.08);
  gap: 14px;
}
.logout-btn i {
  transition: transform 0.2s ease;
}
.logout-btn:hover i {
  transform: translateX(2px);
}

.bottom-nav {
  display: none;
}

@media (max-width: 767px) {
  .sidebar { display: none !important; }
  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #1A1730;
    border-top: 1px solid var(--border-color);
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }
  .bottom-nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    color: #8B88A8;
    text-decoration: none;
    transition: color 0.2s;
  }
  .bottom-nav-item i {
    font-size: 1.4rem;
  }
  .bottom-nav-item.active {
    color: #CDEB45;
  }
}

@media (min-width: 768px) {
  .bottom-nav { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nav-indicator { transition: none; }
  .nav-item:hover i { transform: none; }
  .nav-item:hover { padding-left: 12px; }
  .nav-item.active i { animation: none; }
  .logout-btn:hover i { transform: none; }
  .logout-btn:hover { gap: 10px; }
}
</style>
