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
    },
    {
      path: '/room',
      name: 'Room',
      component: () => import('@/views/Room/RoomView.vue')
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('@/views/Blog/BlogView.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/Blog/AboutView.vue')
    },
    {
      path: '/pblog',
      name: 'Pblog',
      component: () => import('@/views/Blog/PblogView.vue')
    }
  ]
})

router.beforeEach((to: any) => {
  const token = localStorage.getItem('token')
  if ( // 非登录状态下可访问
    !token &&
    !['Login', 'Register', 'Forgot', 'Blog', 'About', 'Pblog'].includes(to.name)
  ) {
    return { name: 'Login' }
  }
})

export default router
