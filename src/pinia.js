import { createPinia } from 'pinia'

/**
 * Singleton Pinia instance shared across the application.
 *
 * Centralizing the instance here allows stores and services
 * outside of Vue components (e.g. repositories, interceptors)
 * to call `useStore()` without needing access to the app object.
 *
 * Usage in main.js:
 *   import pinia from './pinia'
 *   app.use(pinia)
 *
 * Usage outside components:
 *   import pinia from '@/pinia'
 *   import { useAuthStore } from '@/iam/login/application/auth.store'
 *   const auth = useAuthStore(pinia)
 */
const pinia = createPinia()

export default pinia
