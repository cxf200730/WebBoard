import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/Login/index') },
  { path: '/home', component: () => import('@/views/Game/index') },
  { path: '/test', component: () => import('@/views/test') },
  { path: '/test2', component: () => import('@/views/test2') },
  { path: '/home2', component: () => import('@/views/Game2/index') },
  { path: '/teacher', component: () => import('@/views/Teacher/test2') },
  { path: '/student', component: () => import('@/views/Student/login') },
  { path: '/studentclassroom', component: () => import('@/views/Student/index') },
  { path: '/write', component: () => import('@/views/Student2/index') }
  
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   const teacherphone = localStorage.getItem('teacherphone')
//   const studentcode = localStorage.getItem('studentcode')
//   // 缓存中有昵称
//   if (teacherphone || studentcode) {
//     // 当前是登录页
//     if (to.path === '/login') {
//       next({ path: '/studentclassroom' })
//     } else {
//       next()
//     }
//   } else {
//     // 当前是登录页
//     if (to.path === '/login') {
//       next()
//     } else {
//       next({ path: '/login' })
//     }
//   }
// })

export default router
