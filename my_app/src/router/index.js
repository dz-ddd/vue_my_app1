import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'

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
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children: [
        // 默认的首页内容Welcome
        {path: '/welcome',component: Welcome },
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/goods',component:Cate},
        {path:'/params',component:Params},
      ]
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