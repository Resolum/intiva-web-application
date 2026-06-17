import { createRouter, createWebHistory } from 'vue-router';
import iamRoutes from '@/iam/presentation/iam-routes.js';
import analyticsRoutes from '@/analytics/presentation/analytics-routes.js';
import { authenticationGuard } from '@/iam/infrastructure/authentication.guard.js';

// Lazy-loaded shared views
const PageNotFound = () => import('@/shared/presentation/views/page-not-found.vue');

/**
 * Application route definitions organised by bounded context.
 * Each context contributes its own child routes.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    {
        path: '/',
        redirect: '/iam/sign-in',
    },
    {
        path: '/iam',
        name: 'iam',
        children: iamRoutes,
    },
    {
        path: '/analytics',
        name: 'analytics',
        children: analyticsRoutes,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'page-not-found',
        component: PageNotFound,
        meta: { title: 'Page Not Found' },
    },
];

/**
 * Vue Router instance for the application.
 * Uses HTML5 history mode.
 *
 * @type {import('vue-router').Router}
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
});

/**
 * Global navigation guard that updates the document title and enforces authentication.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    // Set the page title
    const baseTitle = 'Intiva';
    document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle;

    // Delegate to the authentication guard
    return authenticationGuard(to, from, next);
});

export default router;
