<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ReportType, ExportFormat } from '@/analytics/domain/model/report.js'
import { reportRepository } from '@/analytics/infrastructure/report.repository.js'
import { useReportService } from '@/analytics/application/report.service.js'

const { t } = useI18n()

const emit = defineEmits(['update:config', 'generate'])

const config = reactive({
  type: ReportType.GENERAL,
  startDate: '2023-10-01',
  endDate: '2023-10-31',
  memberIds: ['carlos', 'maria'],
  format: ExportFormat.PDF
})

const memberNames = {
  carlos: 'C Carlos',
  maria: 'M María'
}

const generating = ref(false)
const generateDone = ref(false)
const reportService = useReportService()

watch(config, (newConfig) => {
  emit('update:config', { ...newConfig })
}, { deep: true, immediate: true })

const removeMember = (id) => {
  config.memberIds = config.memberIds.filter(m => m !== id)
}

const addMemberMock = () => {
  if (!config.memberIds.includes('juan')) {
    memberNames['juan'] = 'J Juan'
    config.memberIds.push('juan')
  }
}

const onGenerate = async () => {
  if (config.memberIds.length === 0) {
    const btn = document.querySelector('.generate-btn')
    if (btn) {
      btn.classList.remove('shake')
      void btn.offsetWidth
      btn.classList.add('shake')
      setTimeout(() => btn.classList.remove('shake'), 600)
    }
    return
  }

  generating.value = true
  generateDone.value = false

  try {
    const data = await reportRepository.getFinancialSummary(config)

    if (config.format === ExportFormat.CSV) {
      reportService.exportToCSV(data.transactions, `reporte-${config.startDate}`)
    } else {
      await reportService.exportToPDF(`reporte-${config.startDate}`)
    }
  } catch (error) {
    console.error('Export failed:', error)
  }

  generating.value = false
  generateDone.value = true
  emit('generate')

  setTimeout(() => {
    generateDone.value = false
  }, 1500)
}

const typeIcons = {
  [ReportType.GENERAL]: 'pi-th-large',
  [ReportType.INCOME]: 'pi-arrow-up',
  [ReportType.EXPENSES]: 'pi-arrow-down',
  [ReportType.SAVINGS]: 'pi-star',
}

const formatIcons = {
  [ExportFormat.PDF]: 'pi-file',
  [ExportFormat.CSV]: 'pi-table',
}

function ripple(e) {
  const card = e.currentTarget
  const existing = card.querySelector('.ripple-effect')
  if (existing) existing.remove()

  const rect = card.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple-effect'
  ripple.style.cssText = `
    width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
    position: absolute;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.3);
    transform: scale(0);
    animation: rippleAnim 0.6s linear forwards;
    pointer-events: none;
  `
  card.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?'
}

function stringToHue(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}
</script>

<template>
  <div class="report-config-card">
    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.reportType') }}</h3>
      <div class="icon-card-grid">
        <button
          v-for="val in Object.values(ReportType)"
          :key="val"
          :class="['icon-card', { active: config.type === val }]"
          @click="config.type = val"
          @mousedown="ripple"
        >
          <i :class="`pi ${typeIcons[val]}`"></i>
          <span>{{ t(`reports.config.types.${val}`) }}</span>
        </button>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.period') }}</h3>
      <div class="date-range">
        <div class="date-input-wrapper">
          <i class="pi pi-calendar date-icon"></i>
          <input type="text" class="date-input" v-model="config.startDate" />
        </div>
        <i class="pi pi-arrow-right date-arrow"></i>
        <div class="date-input-wrapper">
          <i class="pi pi-calendar date-icon"></i>
          <input type="text" class="date-input" v-model="config.endDate" />
        </div>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.members') }}</h3>
      <div class="members-list">
        <div
          v-for="(id, idx) in config.memberIds"
          :key="id"
          class="member-avatar"
          :style="{
            '--avatar-hue': stringToHue(id),
            '--avatar-delay': `${idx * 0.1}s`
          }"
        >
          <span class="avatar-initial">{{ getInitial(memberNames[id]) }}</span>
          <button
            class="avatar-remove"
            @click="removeMember(id)"
            :aria-label="'Remove ' + memberNames[id]"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
        <button
          class="add-member-btn"
          @click="addMemberMock"
          :aria-label="t('reports.config.addMember')"
        >
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.format') }}</h3>
      <div class="icon-card-row">
        <button
          v-for="val in Object.values(ExportFormat)"
          :key="val"
          :class="['icon-card', { active: config.format === val }]"
          @click="config.format = val"
          @mousedown="ripple"
        >
          <i :class="`pi ${formatIcons[val]}`"></i>
          <span>{{ t(`reports.config.formats.${val}`) }}</span>
        </button>
      </div>
    </div>

    <button
      class="generate-btn"
      :class="{ loading: generating, done: generateDone }"
      @click="onGenerate"
    >
      <template v-if="generating">
        <i class="pi pi-spin pi-spinner"></i>
        <span>{{ t('reports.config.generateButton') }}</span>
      </template>
      <template v-else-if="generateDone">
        <i class="pi pi-check"></i>
        <span>{{ t('reports.config.generateButton') }}</span>
      </template>
      <template v-else>
        <i class="pi pi-download"></i>
        <span>{{ t('reports.config.generateButton') }}</span>
      </template>
    </button>
  </div>
</template>

<style scoped>
.report-config-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
  letter-spacing: 0.06em;
}

.icon-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.icon-card-row {
  display: flex;
  gap: 0.5rem;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 1rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  font-family: inherit;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.icon-card i {
  font-size: 1.5rem;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.icon-card span {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.icon-card:hover {
  background: rgba(83, 74, 183, 0.08);
  border-color: var(--color-primary);
}

.icon-card:active {
  transform: scale(0.96);
}

.icon-card.active {
  background: rgba(83, 74, 183, 0.12);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.icon-card.active i {
  color: var(--color-primary-light);
}

.icon-card.active span {
  color: var(--text-primary);
}

@keyframes rippleAnim {
  to { transform: scale(4); opacity: 0; }
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input-wrapper {
  position: relative;
  flex: 1;
}

.date-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.date-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.6rem 0.6rem 2.2rem;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--text-primary);
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.date-arrow {
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.member-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: hsl(var(--avatar-hue), 55%, 45%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: var(--avatar-delay);
  transform: scale(0);
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.member-avatar.removing {
  animation: popOut 0.3s ease forwards;
}

@keyframes popOut {
  to { transform: scale(0); opacity: 0; }
}

.avatar-initial {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}

.avatar-remove {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: var(--color-danger);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
}

.member-avatar:hover .avatar-remove {
  opacity: 1;
}

.avatar-remove:hover {
  transform: scale(1.15);
}

.add-member-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px dashed var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.add-member-btn:hover {
  background: rgba(83, 74, 183, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary-light);
}

.add-member-btn:active {
  transform: scale(0.92);
}

.generate-btn {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), #3C3489);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: opacity 0.2s, transform 0.15s;
}

.generate-btn:hover:not(.loading):not(.done) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.generate-btn:active:not(.loading):not(.done) {
  transform: translateY(0);
}

.generate-btn.loading {
  cursor: wait;
  opacity: 0.8;
}

.generate-btn.done {
  background: linear-gradient(135deg, var(--color-success), #157a5b);
}

.generate-btn.shake {
  animation: shakeBtn 0.4s ease;
}

@keyframes shakeBtn {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .icon-card { transition: none; }
  .icon-card.active { transform: none; }
  .icon-card:active { transform: none; }
  .member-avatar { animation: none; transform: scale(1); }
  .generate-btn.shake { animation: none; }
}
</style>

<style>
@keyframes rippleAnim {
  to { transform: scale(4); opacity: 0; }
}
</style>
