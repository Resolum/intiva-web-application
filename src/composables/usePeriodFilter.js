import { ref, computed } from 'vue'

export function usePeriodFilter() {
  const selectedPeriod = ref('6M')
  const customFrom = ref('')
  const customTo = ref('')

  const dateRange = computed(() => {
    const now = new Date()
    const to = now.toISOString().split('T')[0]
    const periods = {
      '1M': 1, '3M': 3, '6M': 6, '1A': 12
    }
    if (selectedPeriod.value === 'Personalizado') {
      return { from: customFrom.value, to: customTo.value }
    }
    const months = periods[selectedPeriod.value] || 6
    const from = new Date(now.setMonth(now.getMonth() - months))
    return { from: from.toISOString().split('T')[0], to }
  })

  return { selectedPeriod, customFrom, customTo, dateRange }
}
