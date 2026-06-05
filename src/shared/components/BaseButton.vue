<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: 'primary', validator: (v) => ['primary', 'outline', 'google'].includes(v) },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const buttonClasses = computed(() => ({
  'base-button--primary': props.variant === 'primary',
  'base-button--outline': props.variant === 'outline',
  'base-button--google': props.variant === 'google',
  'base-button--loading': props.loading,
  'base-button--disabled': props.disabled || props.loading,
}))
</script>

<template>
  <button :type="type" class="base-button" :class="buttonClasses" :disabled="disabled || loading">
    <svg v-if="variant === 'google' && !loading" class="base-button__icon-google" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <i v-if="loading" class="pi pi-spin pi-spinner base-button__spinner"></i>
    <span class="base-button__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  padding: 0 24px;
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.base-button--primary {
  background-color: var(--color-primary);
  color: #ffffff;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: #433B95;
  box-shadow: 0 4px 12px rgba(83, 74, 183, 0.25);
}

.base-button--primary:active:not(.base-button--disabled) {
  transform: translateY(1px);
}

.base-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.base-button--outline:hover:not(.base-button--disabled) {
  background-color: rgba(83, 74, 183, 0.05);
}

.base-button--google {
  background-color: #ffffff;
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.base-button--google:hover:not(.base-button--disabled) {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button__spinner {
  font-size: 1.1rem;
}
</style>
