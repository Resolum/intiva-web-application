import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/iam/login/interfaces/views/LoginView.vue'
import DashboardView from '@/analytics/interfaces/views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/analytics/interfaces/views/ReportsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/sign-in', '/sign-up']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('auth_token')

  if (authRequired && !loggedIn) {
    return next('/sign-in')
  }

  next()
})

export default router
