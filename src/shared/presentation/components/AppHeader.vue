<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { useNotificationService } from '@/communication/presentation/services/notification.service.js'
import { useNotificationStore } from '@/communication/application/notification.store.js'

const props = defineProps({
  pageTitle: { type: String, required: true },
  alertCount: { type: Number, default: 0 },
})

const { locale, t } = useI18n()
const authStore      = useAuthStore()
const notifService   = useNotificationService()
const notifStore     = useNotificationStore()   
const notifications = computed(() => notifStore.notifications ?? [])
const unreadCount   = computed(() => notifStore.unreadCount ?? 0)
const isLoading     = computed(() => notifStore.isLoading ?? false)

const isDark = ref(false)

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('intiva-theme', dark ? 'dark' : 'light')
  isDark.value = dark
}

function toggleTheme() {
  applyTheme(!isDark.value)
}

function toggleLanguage() {
  const next = locale.value === 'es' ? 'en' : 'es'
  locale.value = next
  localStorage.setItem('intiva-locale', next)
}

const showCalendar = ref(false)
const calendarRef = ref(null)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_ES   = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
const DAYS_EN   = ['Mo','Tu','We','Th','Fr','Sa','Su']

const monthLabel = computed(() =>
  (locale.value === 'es' ? MONTHS_ES : MONTHS_EN)[currentMonth.value] + ' ' + currentYear.value
)

const weekDays = computed(() => locale.value === 'es' ? DAYS_ES : DAYS_EN)

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()  
  const offset = (firstDay === 0 ? 6 : firstDay - 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < offset; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)
  return days
})

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

function isToday(day) {
  return day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
}

const showNotifPanel = ref(false)
const notifPanelRef   = ref(null)   
const notifBtnRef     = ref(null)  
const notifPanelDomRef = ref(null)  
const notifPanelPos   = ref({ top: '0px', right: '0px' })

async function toggleNotifPanel() {
  showCalendar.value = false
  showNotifPanel.value = !showNotifPanel.value
  if (showNotifPanel.value) {
    await Promise.resolve()
    const btn = notifBtnRef.value
    if (btn) {
      const rect = btn.getBoundingClientRect()
      notifPanelPos.value = {
        top:   `${rect.bottom + 10}px`,
        right: `${window.innerWidth - rect.right}px`,
      }
    }
    const currentNotifications = notifications.value
    if (currentNotifications.length === 0) {
      await notifService.fetchUnread(authStore.user?.id)
    }
  }
}

function toggleCalendar() {
  showNotifPanel.value = false
  showCalendar.value = !showCalendar.value
}

function getNotifIcon(type) {
  const map = { budget: 'pi-exclamation-circle', milestone: 'pi-star', shared: 'pi-users', default: 'pi-bell' }
  return 'pi ' + (map[type] ?? map.default)
}

function getNotifColor(type) {
  const map = { budget: '#D85A30', milestone: '#CDEB45', shared: '#534AB7' }
  return map[type] ?? 'var(--color-primary-light)'
}
const avatarInitials = computed(() => {
  const email = authStore.user?.email ?? ''
  if (!email) return '?'
  const local = email.split('@')[0]
  const parts  = local.split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
})

const avatarColor = computed(() => {
  const email = authStore.user?.email ?? ''
  const colors = ['#534AB7', '#1D9E75', '#D85A30', '#EF9F27', '#378ADD', '#7F77DD']
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
})

const userEmail = computed(() => authStore.user?.email ?? '')

function onDocClick(e) {
  if (
    showNotifPanel.value &&
    !notifBtnRef.value?.contains(e.target) &&
    !notifPanelDomRef.value?.contains(e.target)
  ) {
    showNotifPanel.value = false
  }
  if (
    showCalendar.value &&
    calendarRef.value && !calendarRef.value.contains(e.target)
  ) {
    showCalendar.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('intiva-theme')
  applyTheme(savedTheme === 'dark')

  const savedLocale = localStorage.getItem('intiva-locale')
  if (savedLocale === 'en' || savedLocale === 'es') locale.value = savedLocale

  document.addEventListener('mousedown', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocClick)
})
</script>

<template>
  <header class="app-header">
    <h1 class="page-title">{{ pageTitle }}</h1>

    <div class="header-actions">

      <div class="popover-anchor" ref="notifPanelRef" @mousedown.stop>
        <button
          ref="notifBtnRef"
          type="button"
          class="icon-btn"
          :aria-label="t('header.notifications')"
          :aria-expanded="showNotifPanel"
          @click.stop="toggleNotifPanel"
        >
          <i class="pi pi-bell" aria-hidden="true"></i>
          <span
            v-if="unreadCount > 0"
            class="badge"
            aria-live="polite"
          >{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>

        <Transition name="panel">
          <div
            v-if="showNotifPanel"
            ref="notifPanelDomRef"
            class="notif-panel"
            role="dialog"
            :aria-label="t('header.notifications')"
            :style="{ top: notifPanelPos.top, right: notifPanelPos.right }"
            @mousedown.stop
          >
            <div class="panel-header">
              <span class="panel-title">{{ t('header.notifications') }}</span>
              <button
                type="button"
                v-if="unreadCount > 0"
                class="mark-all-btn"
                @click="notifService.markAllRead()"
              >{{ t('header.markAllRead') }}</button>
            </div>
            <div v-if="isLoading" class="panel-empty">
              <i class="pi pi-spin pi-spinner"></i>
            </div>
            <div
              v-else-if="notifications.length === 0"
              class="panel-empty"
            >
              <i class="pi pi-check-circle" style="font-size:1.5rem; color: var(--color-success)"></i>
              <p>{{ t('header.noNotifications') }}</p>
            </div>
            <ul v-else class="notif-list" role="list">
              <li
                v-for="notif in notifications"
                :key="notif.id"
                :class="['notif-item', { unread: !notif.read }]"
                @click="notifService.markRead(notif.id)"
              >
                <span
                  class="notif-icon-wrap"
                  :style="{ background: getNotifColor(notif.type) + '22', color: getNotifColor(notif.type) }"
                >
                  <i :class="getNotifIcon(notif.type)" aria-hidden="true"></i>
                </span>
                <div class="notif-body">
                  <p class="notif-title">{{ notif.title ?? notif.titleKey }}</p>
                  <p class="notif-desc">{{ notif.description ?? notif.message ?? '' }}</p>
                </div>
                <span v-if="!notif.read" class="unread-dot" aria-hidden="true"></span>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
      <div class="popover-anchor" ref="calendarRef" @mousedown.stop>
        <button
          type="button"
          class="icon-btn"
          :aria-label="t('header.calendar')"
          :aria-expanded="showCalendar"
          @click.stop="toggleCalendar"
        >
          <i class="pi pi-calendar" aria-hidden="true"></i>
        </button>

        <Transition name="panel">
          <div v-if="showCalendar" class="calendar-panel" role="dialog" :aria-label="t('header.calendar')" @click.stop>
            <div class="cal-nav">
              <button type="button" class="cal-arrow" @click="prevMonth" aria-label="Previous month">
                <i class="pi pi-chevron-left"></i>
              </button>
              <span class="cal-month-label">{{ monthLabel }}</span>
              <button type="button" class="cal-arrow" @click="nextMonth" aria-label="Next month">
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>

            <div class="cal-grid">
              <span v-for="d in weekDays" :key="d" class="cal-weekday">{{ d }}</span>
              <span
                v-for="(day, i) in calendarDays"
                :key="i"
                :class="['cal-day', { today: isToday(day), empty: !day }]"
              >{{ day ?? '' }}</span>
            </div>
          </div>
        </Transition>
      </div>
      <button type="button" class="icon-btn" :aria-label="t('header.help')">
        <i class="pi pi-question-circle" aria-hidden="true"></i>
      </button>

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
        type="button"
        class="icon-btn"
        @click="toggleTheme"
        :aria-label="t('header.toggleTheme')"
      >
        <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true"></i>
      </button>
      <div class="separator"></div>
      <div
        class="avatar"
        :style="{ background: avatarColor }"
        :title="userEmail"
        :aria-label="userEmail"
        role="img"
      >
        {{ avatarInitials }}
      </div>

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
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 0.5rem;
  overflow: visible;
}
.page-title {
  font-size: clamp(0.9rem, 4vw, 1.1rem);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
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
  transition: background 0.15s, color 0.15s;
}
.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  background: var(--color-danger);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.separator {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 4px;
  flex-shrink: 0;
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
  transition: background 0.15s;
}
.lang-btn:hover { background: var(--bg-secondary); }
.lang-option {
  color: var(--text-muted);
  font-weight: 400;
  transition: color 0.15s;
}
.lang-option.active {
  color: var(--color-primary);
  font-weight: 600;
}
.lang-divider { color: var(--border-color); }

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  cursor: default;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.08);
}

.popover-anchor {
  position: relative;
  overflow: visible;
}

.notif-panel {
  position: fixed;
  width: 320px;
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  z-index: 9999;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--bg-card);
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.mark-all-btn {
  background: none;
  border: none;
  font-size: 11px;
  color: var(--color-primary-light);
  cursor: pointer;
  padding: 0;
}
.mark-all-btn:hover { color: var(--color-primary); }

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 0.5px solid var(--border-color);
  position: relative;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: var(--bg-secondary); }
.notif-item.unread { background: rgba(var(--color-primary-rgb), 0.04); }

.notif-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}
.notif-body { flex: 1; min-width: 0; }
.notif-title {
  margin: 0 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notif-desc {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.unread-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-primary-light);
  flex-shrink: 0;
  margin-top: 6px;
}

.calendar-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 12px;
  z-index: 100;
}
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.cal-month-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.cal-arrow {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  transition: background 0.15s, color 0.15s;
}
.cal-arrow:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}
.cal-weekday {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 4px 0;
  text-transform: uppercase;
}
.cal-day {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 5px 0;
  border-radius: var(--radius-sm);
  cursor: default;
  transition: background 0.1s;
}
.cal-day.empty { pointer-events: none; }
.cal-day:not(.empty):hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.cal-day.today {
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  border-radius: 50%;
}

.panel-enter-active {
  animation: panelIn 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.panel-leave-active {
  animation: panelOut 0.15s ease both;
}
@keyframes panelIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes panelOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-4px) scale(0.97); }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0 0.5rem;
    gap: 0.25rem;
  }
  .lang-btn {
    display: none;
  }
  .icon-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  .avatar {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
  .notif-panel {
    width: 280px;
    right: -40px;
  }
  .calendar-panel {
    width: 240px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active, .panel-leave-active { animation: none; }
}
</style>
