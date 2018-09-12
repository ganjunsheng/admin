// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './styles/index.scss'
// 引入饿了吗组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入外部文件store.js
import store from '@/store/store.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import ECharts from 'vue-echarts'
// 引入vue-amap
import VueAMap from 'vue-amap'
Vue.component('chart', ECharts)
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.use(VueAMap)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '6a204f2b675f32f8849ec4b6b7c21e5c',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
Vue.config.productionTip = false

// 添加全局导航守卫---》全局路由守卫
// 自动调用
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('mytoken')
  // 如果有token值，则next
  if (token) {
    next()
  } else {
    console.log(to)

    // 如果没有token，判断如果是to到/login，next
    if (to.path === '/login') {
      next()
    } else {
      next({name: 'Login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 注入路由
  store,
  components: { App },
  template: '<App/>'
})
