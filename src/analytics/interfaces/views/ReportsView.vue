<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/login/application/auth.store.js'
import { useReportService } from '@/analytics/application/report.service.js'

import AppSidebar from '@/shared/components/AppSidebar.vue'
import AppHeader from '@/shared/components/AppHeader.vue'
import ReportConfig from '@/analytics/interfaces/components/ReportConfig.vue'
import ReportPreview from '@/analytics/interfaces/components/ReportPreview.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const reportService = useReportService()

const isLoading = ref(true)
const isGenerating = ref(false)

const currentConfig = ref(null)
const financialSummary = ref(null)
const transactions = ref([])
const chartData = ref([])

const onLogout = () => {
  authStore.clearAuth()
  router.push('/sign-in')
}

const fetchPreviewData = async (config) => {
  isLoading.value = true
  try {
    const data = await reportService.getPreviewSummary(config)
    financialSummary.value = data.summary
    transactions.value = data.transactions
    chartData.value = data.chartData
  } catch (error) {
    console.error(error)
    // Handle error state if needed
  } finally {
    isLoading.value = false
  }
}

const onConfigChange = (newConfig) => {
  currentConfig.value = newConfig
  fetchPreviewData(newConfig)
}

const onGenerate = async () => {
  if (!currentConfig.value) return
  isGenerating.value = true
  try {
    await reportService.downloadReport(currentConfig.value)
  } catch (error) {
    console.error(error)
  } finally {
    isGenerating.value = false
  }
}

</script>

<template>
  <div class="app-layout">
    <AppSidebar @logout="onLogout" />
    <div class="main-content">
      <AppHeader
        :page-title="t('reports.title')"
        :alert-count="0"
      >
        <template #actions>
          <div class="topbar-actions">
            <button class="action-btn"><i class="pi pi-bell"></i></button>
            <button class="action-btn"><i class="pi pi-calendar"></i></button>
            <button class="action-btn"><i class="pi pi-question-circle"></i></button>
            <button class="outline-btn">{{ t('reports.topbar.filters') }}</button>
            <button class="primary-btn" @click="onGenerate" :disabled="isGenerating">
              {{ t('reports.topbar.download') }}
            </button>
          </div>
        </template>
      </AppHeader>

      <main class="reports-body">
        <div class="reports-layout">
          <!-- Left Panel: Configuration -->
          <div class="config-panel">
            <ReportConfig 
              @update:config="onConfigChange" 
              @generate="onGenerate"
            />
          </div>
          
          <!-- Right Panel: Preview -->
          <div class="preview-panel">
            <div v-if="isLoading" class="loading-state">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <ReportPreview 
              v-else
              :summary="financialSummary"
              :transactions="transactions"
              :chart-data="chartData"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary, #F5F5F5);
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  z-index: 3;
  isolation: isolate;
}

.main-content {
  margin-left: var(--sidebar-width, 220px);
  width: calc(100% - var(--sidebar-width, 220px));
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary, #EEECFD);
  min-height: 100vh;
  box-sizing: border-box;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(83, 74, 183, 0.1);
  color: var(--text-primary);
}

.outline-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.primary-btn {
  background: var(--color-primary);
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reports-body {
  padding: 1.5rem;
  flex: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
}

.reports-layout {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  height: calc(100vh - var(--header-height, 64px) - 3rem);
}

.config-panel {
  width: 380px;
  flex-shrink: 0;
}

.preview-panel {
  flex: 1;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.loading-state {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}
</style>
