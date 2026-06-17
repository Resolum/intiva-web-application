/**
 * Navigation guard that protects non-public routes for anonymous users.
 * Redirects unauthenticated users to the sign-in page.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Current route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
export const authenticationGuard = (to, from, next) => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    const isAuthenticated = token && token !== 'undefined' && user;

    const isPublicRoute = to.name === 'iam-sign-in';
    const routeRequiresAuth = to.matched.some((record) => record.meta?.requiresAuth);

    if (!isAuthenticated && (routeRequiresAuth || (!isPublicRoute && !to.matched.length))) {
        return next({ name: 'iam-sign-in' });
    }

    if (isAuthenticated && isPublicRoute) {
        return next({ name: 'analytics-dashboard' });
    }

    return next();
};
