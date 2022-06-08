import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import "./assets/css/global.css"
// 导入字体图标
import "../src/assets/fonts/iconfont.css"
// 导入axios
import axios from 'axios';
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"


Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
