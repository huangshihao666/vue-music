
import 'babel-polyfill'    // 对ES6的api进行转译
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'  // 解决移动端点击300ms延迟问题
import lazyLoad from 'vue-lazyload'  // 图片懒加载插件

import 'common/stylus/index.styl'  // 首页样式

Vue.config.productionTip = false
fastclick.attach(document.body)   // fastclick插件绑定body
Vue.use(lazyLoad,{  // 初始化 vue-lazyload
	loading:require('common/image/default.png') // 加载的默认图片
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
