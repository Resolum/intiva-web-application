<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition v-if="!route.meta.requiresAuth" name="fade" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
    <component v-else :is="Component" />
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
