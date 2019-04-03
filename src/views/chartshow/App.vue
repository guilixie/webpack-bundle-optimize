<template>
  <div id="app">
    <div style="padding:0 15px;">
      <graph-view :init-data="initData" :init-options="initOptions" init-visible></graph-view>
    </div>
    <footer-menu></footer-menu>
  </div>
</template>

<script>
import FooterMenu from '@/components/FooterMenu'
// import GraphView from '@/components/GraphView'
export default {
  name: 'App',
  components: {
    FooterMenu,
    // GraphView
    GraphView: () => import(/*  webpackChunkName: 'graph-view' */ '@/components/GraphView')
  },
  data () {
    return {
      initOptions: {'charts': {'type': 'bar', 'title': {'text': '', 'subtext': ''}, 'dataZoomEnd': 100, 'tooltip': {'show': true}, 'legend': {'show': true, 'data': ['EXAM_SCORE', 'RG_FUND']}, 'xAxis': {'rotate': '20', 'name': '企业名称', 'dataCol': {'ename': 'REG_CO', 'cname': '企业名称', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}}, 'yAxis': {'name': '值'}, 'series': [{'dataCol': {'ename': 'EXAM_SCORE', 'cname': 'EXAM_SCORE', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}, 'cname': 'EXAM_SCORE', 'max': true, 'min': true, 'average': true}, {'dataCol': {'ename': 'RG_FUND', 'cname': 'RG_FUND', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}, 'cname': 'RG_FUND', 'max': true, 'min': true, 'average': true}]}, 'isValid': true, 'etables': [{'objId': '0b3f7bd529b04fa68508ad0e1f8af891', 'ename': 'company_rel', 'cname': '企业表'}], 'columns': [{'ename': 'REG_CO', 'cname': '企业名称', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}, {'ename': 'EXAM_SCORE', 'cname': 'EXAM_SCORE', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}, {'ename': 'RG_FUND', 'cname': 'RG_FUND', 'dtype': 'TYPE_STRING', 'table': 'company_rel'}]},
      initData: [
        {
          REG_CO: '台州哲汇轻工机械设备有限公司',
          EXAM_SCORE: '1',
          RG_FUND: '479.0466'
        },
        {
          REG_CO: '马鞍山腾帝箱包有限公司',
          EXAM_SCORE: '7',
          RG_FUND: '475.5915'
        },
        {
          REG_CO: '肇庆弘春数码科技有限公司',
          EXAM_SCORE: '9',
          RG_FUND: '702.0005'
        },
        {
          REG_CO: '赤峰欧宏墙体材料有限公司',
          EXAM_SCORE: '1',
          RG_FUND: '447.2356'
        },
        {
          REG_CO: '承德纳郎赫化工科技有限公司',
          EXAM_SCORE: '2',
          RG_FUND: '746.8586'
        },
        {
          REG_CO: '蚌埠晓雷锐领制冷设备有限公司',
          EXAM_SCORE: '5',
          RG_FUND: '288.0078'
        },
        {
          REG_CO: '阳江宏策途恒轻工机械设备有限公司',
          EXAM_SCORE: '5',
          RG_FUND: '221.0677'
        },
        {
          REG_CO: '鄂州云翌志燕机电设备有限公司',
          EXAM_SCORE: '6',
          RG_FUND: '720.5981'
        },
        {
          REG_CO: '安康霏欣鼎佳园艺有限公司',
          EXAM_SCORE: '7',
          RG_FUND: '548.4468'
        },
        {
          REG_CO: '濮阳科芬聪建筑工程技术有限公司',
          EXAM_SCORE: '9',
          RG_FUND: '930.2918'
        },
        {
          REG_CO: '百色通唯骏光电科技有限公司',
          EXAM_SCORE: '4',
          RG_FUND: '182.8737'
        },
        {
          REG_CO: '深圳菁骏会装潢设计有限公司',
          EXAM_SCORE: '6',
          RG_FUND: '344.8559'
        },
        {
          REG_CO: '南平竹腾凤化纤有限公司',
          EXAM_SCORE: '6',
          RG_FUND: '201.0837'
        },
        {
          REG_CO: '桂林轩臻日船舶配件有限公司',
          EXAM_SCORE: '10',
          RG_FUND: '392.8942'
        },
        {
          REG_CO: '榆林霖艺五金配件有限公司',
          EXAM_SCORE: '1',
          RG_FUND: '385.022'
        }
      ]
    }
  }
}
</script>

<style>
</style>
