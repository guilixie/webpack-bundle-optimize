// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css'
import '@/assets/style/common.css'
import '@/assets/icons'
import VueClipboard from 'vue-clipboard2'
import App from './App'

Vue.config.productionTip = false

VueClipboard.config.autoSetContainer = true

Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
