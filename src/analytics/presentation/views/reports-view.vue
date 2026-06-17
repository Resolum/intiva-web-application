<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/iam/application/auth.store.js'
import { useReportPresentationService } from '@/analytics/presentation/services/report.service.js'
import { useFamilyGroupStore } from '@/household/application/family-group.store.js'

import AppLayout from '@/shared/presentation/components/AppLayout.vue'
import ReportConfig from '@/analytics/presentation/components/ReportConfig.vue'
import ReportPreview from '@/analytics/presentation/components/ReportPreview.vue'
import { exportToCSV, exportToPDF } from '@/analytics/presentation/utils/report-export.js'

const { t } = useI18n()
const router = useRouter()
const authStore    = useAuthStore()
const reportService = useReportPresentationService()
const familyStore  = useFamilyGroupStore()

const isLoading = ref(true)
const isGenerating = ref(false)
const reportConfigRef = ref(null)

const currentConfig = ref(null)
const previewMeta = ref({ periodStart: '', periodEnd: '', generatedAt: '' })
const financialSummary = ref(null)
const transactions = ref([])
const chartData = ref([])

/**
 * Handles user logout: clears auth, resets family group, and redirects to sign-in.
 */
const onLogout = () => {
  authStore.signOut()
  familyStore.reset()
  router.push({ name: 'iam-sign-in' })
}

onMounted(async () => {
  if (authStore.user?.id) {
    await familyStore.discoverAndLoad(authStore.user.id, authStore.familyId)
  }
})

/**
 * Normalizes an ISO date string to a valid YYYY-MM-DD format.
 * @param {string} value - Raw date value.
 * @returns {string} Normalized date string.
 */
function normalizeIsoDate(value) {
  if (!value) return ''
  const m = String(value).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!m) return value
  const y = parseInt(m[1], 10)
  const mm = parseInt(m[2], 10)
  let dd = parseInt(m[3], 10)
  const month = Math.min(12, Math.max(1, mm))
  const lastDay = new Date(y, month, 0).getDate()
  if (dd > lastDay) dd = lastDay
  const pad = (n) => String(n).padStart(2, '0')
  return `${y}-${pad(month)}-${pad(dd)}`
}

/**
 * Fetches preview data for the report configuration.
 * @param {Object} config - Report configuration object.
 */
const fetchPreviewData = async (config) => {
  isLoading.value = true
  try {
    const start = normalizeIsoDate(config.startDate)
    const end = normalizeIsoDate(config.endDate)
    const s = new Date(start)
    const e = new Date(end)
    const periodStart = s <= e ? start : end
    const periodEnd = s <= e ? end : start

    const data = await reportService.getPreviewSummary({
      ownerId: authStore.user?.id,
      ownerType: 'INDIVIDUAL',
      periodStart,
      periodEnd,
      categoryId: config.categoryId,
    })
    console.debug('[ReportsView] preview data:', data)
    financialSummary.value = data.summary
    transactions.value = data.transactions
    chartData.value = data.chartData
    previewMeta.value = {
      periodStart: config.startDate,
      periodEnd: config.endDate,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles configuration changes from the ReportConfig component.
 * @param {Object} newConfig - Updated report configuration.
 */
const onConfigChange = (newConfig) => {
  currentConfig.value = newConfig
  fetchPreviewData(newConfig)
}

/**
 * Generates and exports the report in the selected format (CSV or PDF).
 */
const onGenerate = async () => {
  if (!currentConfig.value) return
  isGenerating.value = true
  const format = currentConfig.value.format
  const exportPayload = {
    title: t('reports.preview.title'),
    periodStart: currentConfig.value.startDate,
    periodEnd: currentConfig.value.endDate,
    members: currentConfig.value.memberIds,
    summary: financialSummary.value ?? {},
    transactions: transactions.value,
  }

  try {
    if (format === 'csv') {
      exportToCSV(exportPayload, `reporte-${currentConfig.value.startDate}`)
    } else {
      await exportToPDF(exportPayload, `reporte-${currentConfig.value.startDate}`)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isGenerating.value = false
    reportConfigRef.value?.onGenerateDone()
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
            ref="reportConfigRef"
            :is-generating="isGenerating"
            :family-id="authStore.familyId"
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
            :summary="financialSummary ?? { totalIncome: 0, totalExpenses: 0, netSavings: 0 }"
            :transactions="transactions"
            :chart-data="chartData"
            :period-start="previewMeta.periodStart"
            :period-end="previewMeta.periodEnd"
            :generated-at="previewMeta.generatedAt"
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
