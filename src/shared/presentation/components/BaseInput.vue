<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  icon: { type: String, default: null },
  error: { type: String, default: null },
  id: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])
const showPassword = ref(false)

const effectiveType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  return props.type
})

const inputId = computed(() => props.id ?? props.label.toLowerCase().replace(/\s+/g, '-'))

const handleInput = (event) => emit('update:modelValue', event.target.value)
const togglePasswordVisibility = () => showPassword.value = !showPassword.value
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label :for="inputId" class="base-input__label">{{ label }}</label>
    <div class="base-input__wrapper">
      <span v-if="icon" class="base-input__icon-leading" aria-hidden="true"><i :class="icon" /></span>
      <input
        :id="inputId"
        class="base-input__field"
        :class="{ 'base-input__field--with-icon': icon, 'base-input__field--with-toggle': type === 'password' }"
        :type="effectiveType"
        :value="modelValue"
        :placeholder="placeholder"
        autocomplete="off"
        @input="handleInput"
      />
      <button v-if="type === 'password'" type="button" class="base-input__toggle" @click="togglePasswordVisibility">
        <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" />
      </button>
    </div>
    <span v-if="error" class="base-input__error" role="alert"><i class="pi pi-exclamation-circle"></i> {{ error }}</span>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.base-input__label {
  font-family: var(--font-label, 'Space Grotesk', sans-serif);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__icon-leading {
  position: absolute;
  left: 14px;
  color: var(--color-neutral);
  font-size: 1rem;
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.base-input__field {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.95rem;
  color: var(--color-text-main);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.base-input__field--with-icon { padding-left: 42px; }
.base-input__field--with-toggle { padding-right: 44px; }
.base-input__field::placeholder { color: #9CA3AF; }

.base-input__field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
}
.base-input__field:focus + .base-input__icon-leading,
.base-input__field:focus ~ .base-input__icon-leading {
  color: var(--color-primary);
}

.base-input--error .base-input__field {
  border-color: #EF4444;
}
.base-input--error .base-input__field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.base-input__toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-neutral);
  font-size: 1.1rem;
  transition: color 0.2s ease;
}
.base-input__toggle:hover { color: var(--color-primary); }

.base-input__error {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.85rem;
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
