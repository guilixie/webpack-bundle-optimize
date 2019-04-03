// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Input } from 'element-ui'
import ResizableBox from 'vue-resizable-box'
import store from './store'
import 'normalize.css'
import '@/assets/style/glyphicon.less'
import '@/assets/style/common.css'
import '@/assets/style/comp-tree.less'
import '@/assets/icons'
import App from './App'

Vue.config.productionTip = false

Vue.use(ResizableBox)
Vue.use(Input)

// 全局注册组件
Vue.component('glyph-icon', {
  template: '<i class="glyphicon" :class="name" :style="{color: color, fontSize: fontSize}"></i>',
  props: ['name', 'color', 'fontSize']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
