<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ReportType, ExportFormat } from '@/analytics/domain/model/report.js'

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

const onGenerate = () => {
  emit('generate')
}
</script>

<template>
  <div class="report-config-card">
    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.reportType') }}</h3>
      <div class="toggle-group type-group">
        <button 
          v-for="val in Object.values(ReportType)" 
          :key="val"
          :class="['toggle-btn', { active: config.type === val }]"
          @click="config.type = val"
        >
          {{ t(`reports.config.types.${val}`) }}
        </button>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.period') }}</h3>
      <div class="date-pickers">
        <div class="date-input-wrapper">
          <i class="pi pi-calendar date-icon"></i>
          <input type="text" class="date-input" v-model="config.startDate" />
        </div>
        <span class="date-separator">-</span>
        <div class="date-input-wrapper">
          <i class="pi pi-calendar date-icon"></i>
          <input type="text" class="date-input" v-model="config.endDate" />
        </div>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.members') }}</h3>
      <div class="members-list">
        <div class="member-chip" v-for="id in config.memberIds" :key="id">
          <span>{{ memberNames[id] }}</span>
          <button class="remove-btn" @click="removeMember(id)" :aria-label="'Remove ' + memberNames[id]">×</button>
        </div>
        <button class="add-member-btn" @click="addMemberMock" :aria-label="t('reports.config.addMember')">
          +
        </button>
      </div>
    </div>

    <div class="config-section">
      <h3 class="section-title">{{ t('reports.config.format') }}</h3>
      <div class="toggle-group format-group">
        <button 
          v-for="val in Object.values(ExportFormat)" 
          :key="val"
          :class="['toggle-btn', { active: config.format === val }]"
          @click="config.format = val"
        >
          {{ t(`reports.config.formats.${val}`) }}
        </button>
      </div>
    </div>

    <button class="generate-btn" @click="onGenerate">
      <i class="pi pi-bolt"></i>
      {{ t('reports.config.generateButton') }}
    </button>
  </div>
</template>

<style scoped>
.report-config-card {
  background: var(--bg-card);
  border: 0.5px solid var(--border-color);
  border-radius: var(--radius-lg, 16px);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', sans-serif;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.05em;
}

.toggle-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.toggle-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
}

.toggle-btn:hover {
  background: rgba(83, 74, 183, 0.1);
}

.toggle-btn.active {
  background: var(--color-primary);
  color: #FFFFFF;
  border-color: var(--color-primary);
}

.date-pickers {
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
  font-size: 0.9rem;
}

.date-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.6rem 0.6rem 2.2rem;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
}

.date-separator {
  color: var(--text-muted);
  font-weight: bold;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.member-chip {
  background: rgba(83, 74, 183, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-member-btn {
  background: transparent;
  border: 1px dashed var(--border-color);
  border-radius: 16px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  cursor: pointer;
}

.add-member-btn:hover {
  background: rgba(83, 74, 183, 0.1);
}

.generate-btn {
  margin-top: 1rem;
  width: 100%;
  background: var(--color-neon, #CDEB45);
  color: #141023;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s ease;
}

.generate-btn:hover {
  background: #B8D634;
}
</style>
