import { ref, computed } from 'vue'

export function usePeriodFilter() {
  const selectedPeriod = ref('6M')
  const customFrom = ref('')
  const customTo = ref('')

  const dateRange = computed(() => {
    if (selectedPeriod.value === 'Personalizado') {
      return { from: customFrom.value, to: customTo.value }
    }

    const PERIOD_MONTHS = { '1M': 1, '3M': 3, '6M': 6, '1A': 12 }
    const months = PERIOD_MONTHS[selectedPeriod.value] ?? 6

    const toDate   = new Date()
    const fromDate = new Date()
    fromDate.setMonth(fromDate.getMonth() - months)

    return {
      from: fromDate.toISOString().split('T')[0],
      to:   toDate.toISOString().split('T')[0],
    }
  })

  return { selectedPeriod, customFrom, customTo, dateRange }
}
