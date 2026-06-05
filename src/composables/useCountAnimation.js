import { ref, watch } from 'vue'

export function useCountAnimation(target, duration = 1200) {
  const current = ref(0)

  watch(target, (newVal) => {
    const start = current.value
    const startTime = performance.now()

    const animate = (time) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      current.value = Math.round(start + (newVal - start) * ease)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, { immediate: true })

  return current
}
