/**
 * Lazy-loaded IAM view components.
 */
const SignInView = () => import('@/iam/presentation/views/sign-in-view.vue');

/**
 * Route definitions for the IAM (Identity & Access Management) bounded context.
 * All paths are relative to the `/iam` parent route.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const iamRoutes = [
    { path: 'sign-in', name: 'iam-sign-in', component: SignInView, meta: { title: 'Sign In' } },
];

export default iamRoutes;
