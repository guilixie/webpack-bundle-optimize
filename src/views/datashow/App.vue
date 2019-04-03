<template>
  <div id="app">
    <div style="padding:0 15px;">
      <table-view :data="list.data" :headdata="list.head" :pager="list.pager" @getList="getList" stripe border haspager></table-view>
    </div>
    <footer-menu></footer-menu>
  </div>
</template>

<script>
import FooterMenu from '@/components/FooterMenu'
const TableView = () => import(/* webpackChunkName: 'table-view' */'@/components/TableView')

const Mock = require('mockjs')
const Random = Mock.Random

export default {
  name: 'App',
  components: {
    TableView,
    FooterMenu
  },
  data () {
    return {
      list: {
        head: [
          {prop: 'name', label: '姓名'},
          {prop: 'age', label: '年龄'},
          {prop: 'address', label: '地址'},
          {prop: 'job', label: '职业'},
          {prop: 'jobage', label: '工龄'},
          {prop: 'birthday', label: '出生日期'}
        ],
        data: [],
        pager: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  mounted () { this.getList() },
  methods: {
    getList () {
      this.list.data = Mock.mock({
        'list|10': [{
          id: () => Random.guid(),
          name: () => Random.cname(),
          age: () => Random.natural(100),
          address: () => Random.city(true),
          'job|1': ['医生', 'IT研发', '护士', '银行业务员', '汽车销售'],
          jobage: () => Random.natural(100),
          birthday: () => Random.date()
        }]
      }).list
      this.list.pager.total = 100
    }
  }
}
</script>
