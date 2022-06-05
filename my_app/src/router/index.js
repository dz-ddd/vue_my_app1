import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向到登录组件
    {
      path: '/',
      redirect: '/login'
    },
    // 登录组件
    {
      path: '/login',
      component: Login
    },
    // 主页
    {
      path: '/Home',
      component: Home
    },
  ],
})

//路由导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径 from 从哪个路径跳转过来  next 是一个函数 表示放行的条件
  // next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router 