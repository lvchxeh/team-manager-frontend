import { createRouter, createWebHistory } from 'vue-router'
import ProfilePage from '../pages/ProfilePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import MembersPage from '../pages/MembersPage.vue'
import AttendancePage from '../pages/AttendancePage.vue'
import StatsPage from '../pages/StatsPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/members', component: MembersPage, meta: { requiresAuth: true } },
  { path: '/attendance', component: AttendancePage, meta: { requiresAuth: true } },
  { path: '/stats', component: StatsPage, meta: { requiresAuth: true } },
  { path: '/profile',component: ProfilePage,meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登入守衛
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedInUser')
  if (to.meta.requiresAuth && !loggedIn) {
    alert('⚠️ 請先登入才能進入此頁面！')
    next('/login')
  } else {
    next()
  }
})

export default router
