import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入全局样式
import "./assets/css/global.css"
// 导入字体图标
import "../src/assets/fonts/iconfont.css"
// 导入axios
import axios from 'axios';
// 导入富文本编辑器 vue-quill-editor
import VueQuillEditor from "vue-quill-editor"
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 全局时间过滤器
Vue.filter('dateFormat',function(originVal) {
    const dt =  new Date(originVal)
    const y =  dt.getFullYear()
    const m =  (dt.getMonth() + 1 +'').padStart(2,'0')
    const d =  (dt.getDate() +'').padStart(2,'0')

    const hh =  (dt.getHours() + '').padStart(2,'0')
    const mm =  (dt.getMinutes() + '').padStart(2,'0')
    const ss =  (dt.getSeconds() + '').padStart(2,'0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 注册全局组件
Vue.component('tree-table',TreeTable)
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

// 注册富文本编辑器 vue-quill-editor
Vue.use(VueQuillEditor)
// 语法提示关闭
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
