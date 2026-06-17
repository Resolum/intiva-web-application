<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />
  <router-view />
</template>
