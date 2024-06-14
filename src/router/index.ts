import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AboutView,
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to: any) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !localStorage.getItem('token')) {
    return {
      path: '/login',
      query: { returnUrl: to.href },
    }
  } else if (authRequired && localStorage.getItem('token')) {
    authStore.token = JSON.parse(localStorage.getItem('token') as string)
  }
})

export default router
