<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  pageTitle: { type: String, required: true },
  alertCount: { type: Number, default: 0 },
});

const { locale, t } = useI18n();

const isDark = ref(false);

/**
 * Applies a theme by setting data-theme on <html> and saving to localStorage.
 * @param {boolean} dark - true for dark mode, false for light mode
 */
function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("intiva-theme", dark ? "dark" : "light");
  isDark.value = dark;
}

function toggleTheme() {
  applyTheme(!isDark.value);
}

function toggleLanguage() {
  const next = locale.value === "es" ? "en" : "es";
  locale.value = next;
  localStorage.setItem("intiva-locale", next);
}

onMounted(() => {
  const savedTheme = localStorage.getItem("intiva-theme");
  applyTheme(savedTheme === "dark");

  const savedLocale = localStorage.getItem("intiva-locale");
  if (savedLocale === "en" || savedLocale === "es") {
    locale.value = savedLocale;
  }
});
</script>

<template>
  <header class="app-header">
    <h1 class="page-title">{{ pageTitle }}</h1>
    <div class="header-actions">
      <button class="icon-btn" :aria-label="t('header.switchLanguage')">
        <i class="pi pi-bell" aria-hidden="true"></i>
        <span v-if="alertCount > 0" class="badge">{{ alertCount }}</span>
      </button>
      <button class="icon-btn" aria-label="Calendar">
        <i class="pi pi-calendar" aria-hidden="true"></i>
      </button>
      <button class="icon-btn" aria-label="Help">
        <i class="pi pi-question-circle" aria-hidden="true"></i>
      </button>
      <div class="separator"></div>
      <button class="btn-outline">{{ t("header.filters") }}</button>
      <div class="separator"></div>
      <button
        class="lang-btn"
        @click="toggleLanguage"
        :aria-label="t('header.switchLanguage')"
      >
        <span :class="['lang-option', { active: locale === 'es' }]">ES</span>
        <span class="lang-divider">|</span>
        <span :class="['lang-option', { active: locale === 'en' }]">EN</span>
      </button>
      <button
        class="icon-btn"
        @click="toggleTheme"
        :aria-label="t('header.toggleTheme')"
      >
        <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true"></i>
      </button>
      <div class="avatar" aria-hidden="true">MP</div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 0.5px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}
.page-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
  transition: background 0.15s;
}
.icon-btn:hover {
  background: var(--bg-secondary);
}
.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.separator {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 4px;
}
.btn-outline {
  padding: 6px 14px;
  border: 0.5px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-outline:hover {
  background: var(--bg-secondary);
}
.btn-neon {
  padding: 6px 14px;
  border: none;
  background: var(--color-neon);
  color: #1a1730;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-neon:hover {
  opacity: 0.88;
}
.lang-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 0.5px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
}
.lang-option {
  color: var(--text-muted);
  font-weight: 400;
  transition: color 0.15s;
}
.lang-option.active {
  color: var(--color-primary);
  font-weight: 600;
}
.lang-divider {
  color: var(--border-color);
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}
</style>
