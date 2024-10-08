import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import CarsView from '../views/CarsView.vue'
import InspectionsView from '../views/Inspections.vue'
import RentalsView from '../views/Rentals.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { useAuthStore } from '@/stores'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'

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
    {
      path: '/inspections/:id',
      name: 'inspections',
      component: InspectionsView,
    },
    {
      path: '/rentals/:id',
      name: 'rentals',
      component: RentalsView,
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
    const userData = await fetchWrapper.get(`${API_STOCK}/user/token`, '')
    if (userData) {
      authStore.user = userData.user
      authStore.persistToLocalStorage()
    }
  }
})

export default router
