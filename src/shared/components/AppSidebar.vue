<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['logout'])
const route = useRoute()
const { t } = useI18n()

/**
 * Navigation items definition.
 * Each item has a label key, Tabler icon name, and target route path.
 */
const navItems = [
  { labelKey: 'nav.dashboard', icon: 'th-large',  path: '/dashboard' },
  { labelKey: 'nav.reports',   icon: 'chart-bar', path: '/reports'   },
]

/**
 * Returns true if the given path matches the current route.
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
function isActive(path) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo area -->
    <div class="sidebar-logo">
      <div class="logo-mark" aria-hidden="true">IN</div>
      <div>
        <p class="logo-name">{{ t('app.name') }}</p>
        <p class="logo-sub">{{ t('app.subtitle') }}</p>
      </div>
    </div>
    <nav class="sidebar-nav" role="navigation" :aria-label="t('nav.dashboard')">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item.path) }]"
      >
        <i :class="`pi pi-${item.icon}`" aria-hidden="true"></i>
        <span>{{ t(item.labelKey) }}</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <div class="plan-badge">
        <i class="pi pi-star" aria-hidden="true"></i>
        {{ t('plan.premium') }}
      </div>
      <button class="logout-btn" @click="emit('logout')">
        <i class="pi pi-sign-out" aria-hidden="true"></i>
        {{ t('logout') }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0; top: 0;
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
  width: 32px; height: 32px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700;
  flex-shrink: 0;
}
.logo-name {
  margin: 0;
  font-size: 14px; font-weight: 600;
  color: #EAE8FF;
}
.logo-sub {
  margin: 0;
  font-size: 10px;
  color: #6B6890;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  color: #C8C5E8;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border-left: 3px solid transparent;
}
.nav-item:hover {
  background: rgba(127, 119, 221, 0.08);
  color: #EAE8FF;
}
.nav-item.active {
  background: rgba(205, 235, 69, 0.12);
  color: #CDEB45;
  border-left-color: #CDEB45;
}
.nav-item i { font-size: 17px; }
.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 0.5px solid rgba(127, 119, 221, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.plan-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(205, 235, 69, 0.08);
  border: 0.5px solid rgba(205, 235, 69, 0.3);
  color: #CDEB45;
  font-size: 12px;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: rgba(200, 197, 232, 0.55);
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  width: 100%;
  text-align: left;
}
.logout-btn:hover { color: var(--color-danger); background: rgba(216,90,48,0.08); }
</style>
