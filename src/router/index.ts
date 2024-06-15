import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import CarsView from '../views/CarsView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AboutView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/cars',
      name: 'cars',
      component: CarsView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to: any) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/about', '/register']
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
