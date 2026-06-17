<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

/**
 * Navigates back to the sign-in page.
 */
const goHome = () => {
    router.push({ name: 'iam-sign-in' });
};
</script>

<template>
    <div class="not-found">
        <h1 class="not-found__code">404</h1>
        <p class="not-found__message">{{ t('pageNotFound.message') || 'Page not found' }}</p>
        <pv-button :label="t('pageNotFound.goHome') || 'Go Home'" @click="goHome" />
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
}

.not-found__code {
    font-size: 6rem;
    font-weight: 800;
    color: var(--color-primary);
    margin: 0;
}

.not-found__message {
    font-size: 1.2rem;
    color: var(--text-muted);
    margin: 0;
}
</style>
