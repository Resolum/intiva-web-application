<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'dark',
  },
})
</script>

<template>
  <div class="app-logo" :class="`app-logo--${variant}`">
    <svg class="app-logo__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="10" class="app-logo__icon-bg" />
      <rect x="8" y="22" width="5" height="10" rx="2.5" class="app-logo__icon-bar" />
      <rect x="17.5" y="14" width="5" height="18" rx="2.5" class="app-logo__icon-bar" />
      <rect x="27" y="8" width="5" height="24" rx="2.5" class="app-logo__icon-bar" />
    </svg>
    <span class="app-logo__wordmark">intiva</span>
  </div>
</template>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.app-logo__icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.app-logo--light .app-logo__icon-bg { fill: rgba(255, 255, 255, 0.1); }
.app-logo--light .app-logo__icon-bar { fill: var(--color-secondary); }
.app-logo--light .app-logo__wordmark { color: #FFFFFF; }

.app-logo--dark .app-logo__icon-bg { fill: rgba(83, 74, 183, 0.1); }
.app-logo--dark .app-logo__icon-bar { fill: var(--color-primary); }
.app-logo--dark .app-logo__wordmark { color: var(--color-primary); }

.app-logo__wordmark {
  font-family: var(--font-headline, 'Manrope', sans-serif);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1;
}
</style>
