import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
// vmp模块状态管理

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    vmp: {
      namespaced: true,
      state,
      getters,
      mutations,
      actions
    }
  }
})

// 添加热重载
if (module.hot) {
  module.hot.accept([
    './getters',
    './actions',
    './mutations'
  ], () => {
    const newGetters = require('./getters').default
    const newMutations = require('./mutations').default
    const newActions = require('./actions').default

    // console.log(newGetters, newMutations, newActions)

    store.hotUpdate({
      getters: newGetters,
      mutations: newMutations,
      actions: newActions
    })
  })
}

export default store
