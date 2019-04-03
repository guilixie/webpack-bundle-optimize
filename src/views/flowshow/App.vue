<template>
  <div id="app">
    <div style="padding:0 15px;height:100%;">
      <vue-resizable-box :option="option">
        <template #left>
          <div class="box-all border-box">
            <component-lib></component-lib>
          </div>
        </template>
        <template #right>
          <div class="box-all border-box" style="overflow:auto;">
            <flow-chart :current-node-id="currentNodeId" :nodes="nodes" :connections="connections"></flow-chart>
          </div>
        </template>
      </vue-resizable-box>
    </div>
    <footer-menu></footer-menu>
  </div>
</template>

<script>
import FooterMenu from '@/components/FooterMenu'
import ComponentLib from '@/components/ComponentLib'
// import FlowChart from '@/components/FlowChart'
import { createNamespacedHelpers } from 'vuex'
const {mapGetters} = createNamespacedHelpers('vmp')

export default {
  name: 'App',
  components: {
    FooterMenu,
    ComponentLib,
    FlowChart: () => import(/* webpackChunkName: 'flow-chart' */'@/components/FlowChart')
  },
  data () {
    return {
      option: {
        left: { size: 1 },
        right: { size: 2 }
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentNodeId',
      'nodes',
      'connections'
    ])
  }
}
</script>

<style>

</style>
