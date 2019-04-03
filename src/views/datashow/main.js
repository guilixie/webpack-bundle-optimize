// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css'
import { Table, TableColumn, Pagination, Loading } from 'element-ui'
import '@/assets/style/common.css'
import '@/assets/icons'
import App from './App'

Vue.config.productionTip = false

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Loading.directive)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
