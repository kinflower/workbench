import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/HomeView.vue')
    },
    {
      path: '/forgot',
      name: 'Forgot',
      component: () => import('@/views/Forgot/ForgotView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/LoginView.vue')
    },
    {
      path: '/personage',
      name: 'Person',
      component: () => import('@/views/Person/PersonView.vue')
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('@/views/Setting/SettingView.vue')
    }
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (
    !token &&
    (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Forgot')
  ) {
    return { name: 'Login' }
  }
})

export default router
