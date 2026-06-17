<script setup>
import { useRoute } from 'vue-router'
import AppSidebar from '@/shared/presentation/components/AppSidebar.vue'
import AppHeader from '@/shared/presentation/components/AppHeader.vue'

const props = defineProps({
  pageTitle: { type: String, required: true },
  alertCount: { type: Number, default: 0 },
})

const emit = defineEmits(['logout'])

const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <AppSidebar @logout="emit('logout')" />
    <div class="main-content">
      <AppHeader :page-title="pageTitle" :alert-count="alertCount" />
      <Transition name="page" mode="out-in">
        <main class="page-body" :key="route.path">
          <slot />
        </main>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 3;
  isolation: isolate;
  background: var(--bg-primary);
  font-family: 'Inter', system-ui, sans-serif;
}

.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  min-height: 100vh;
  width: calc(100% - var(--sidebar-width));
  box-sizing: border-box;
}

.page-body {
  flex: 1;
}
.page-enter-active {
  animation: pageIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.page-leave-active {
  animation: pageOut 0.18s cubic-bezier(0.55, 0, 1, 0.45) both;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-6px);
  }
}

@media (max-width: 767px) {
  .main-content {
    margin-left: 0 !important;
    width: 100% !important;
    padding-bottom: 60px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    animation: none;
    transition: opacity 0.15s ease;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
}
</style>
