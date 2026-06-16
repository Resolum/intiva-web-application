/**
 * Lazy-loaded Analytics view components.
 */
const DashboardView = () => import('@/analytics/presentation/views/dashboard-view.vue');
const ReportsView = () => import('@/analytics/presentation/views/reports-view.vue');

/**
 * Route definitions for the Analytics bounded context.
 * All paths are relative to the `/analytics` parent route.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const analyticsRoutes = [
    { path: 'dashboard', name: 'analytics-dashboard', component: DashboardView, meta: { title: 'Dashboard', requiresAuth: true } },
    { path: 'reports', name: 'analytics-reports', component: ReportsView, meta: { title: 'Reports', requiresAuth: true } },
];

export default analyticsRoutes;
