<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/login/application/auth.store.js'
import { useReportService } from '@/analytics/application/report.service.js'

import AppLayout from '@/shared/components/AppLayout.vue'
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
  <AppLayout
    :page-title="t('reports.title')"
    :alert-count="0"
    @logout="onLogout"
  >
    <div class="reports-body">
      <div class="reports-layout">
        <div class="config-panel">
          <ReportConfig
            @update:config="onConfigChange"
            @generate="onGenerate"
          />
        </div>
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
    </div>
  </AppLayout>
</template>

<style scoped>
.reports-body {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  max-width: 100%;
}

.reports-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.config-panel {
  width: 100%;
}

.preview-panel {
  width: 100%;
  min-height: 400px;
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

@media (max-width: 1023px) {
  .reports-layout {
    flex-direction: column;
  }

  .config-panel {
    width: 100%;
  }

  .preview-panel {
    width: 100%;
    min-height: 500px;
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  .reports-body {
    padding: 1.5rem;
  }
  .reports-layout {
    flex-direction: row;
    height: calc(100vh - var(--header-height, 64px) - 3rem);
  }
  .config-panel {
    width: 380px;
    flex-shrink: 0;
  }
  .preview-panel {
    flex: 1;
  }
}
</style>
