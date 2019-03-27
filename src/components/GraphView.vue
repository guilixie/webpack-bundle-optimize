<template>
  <div :id="chartId" class="graphView" v-loading="loadStatus"
    element-loading-text="加载中..." element-loading-spinner="el-icon-loading"
    :element-loading-background="loadingColor">
    <template v-if="progressMsg !== ''">
      <div class="graphView warningInfo">
        <span>{{progressMsg}}</span>
      </div>
    </template>
    <v-echarts v-else-if="defaultOptions.type !== 'table'"
      :init-options="renderMode"
      :options="options"
      :autoresize="true">
    </v-echarts>
    <el-table v-else :data="tableData" style="width: 100%" max-height="600" :border="true" stripe>
      <el-table-column v-for="(col, index) in tableCol" :key="index" :prop="col" :label="col"></el-table-column>
    </el-table>
    <transition name="selector-fade">
      <charts-selector v-show="chartSelectorVisible"
        :charts="chartList"
        :current="defaultOptions.type"
        :visible="chartMenuVisible"
        :style-obj="chartMenuPosition"
        @change-state="updateChartsMenu"
        @mouseleave.native="chartMenuVisible=false">
      </charts-selector>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts-wordcloud'
import 'echarts/map/js/china'
import china from 'echarts/map/json/china' // 全部省份及其省会坐标
import cities from 'echarts/map/json/china-cities'  // 主要城市及其坐标
import defaultChartList from '@/utils/charts.js'
import ChartsSelector from '@/components/ChartsSelector'

export default {
  name: "graphView",
  props: {
    initData: Array,
    initIndex: [Number, String],
    initOptions: Object,
    initVisible : { // chartSelector是否显示的默认参数
      type: Boolean,
      default: false
    },
    loadStatus: { // 是否加载中
      type: Boolean,
      default: false
    },
    loadingColor: 'rgba(240, 240, 240, 0.8)',
  },
  components: {
    ChartsSelector,
    defaultChartList,
    'v-echarts': ECharts
  },
  data() {
    return {
      chartId: "graphView" + this.initIndex,
      renderMode: {
        renderer: "canvas" // 可切换svg
      },
      options: {},
      citiesData: {},
      tableCol: [], //  数据展示为table时的table column
      tableData: [],
      value: '',  // el-select必需的变量
      progressMsg: '',    // 进展信息
      xAxisData: [],
      yAxisDataObj: {},
      seriesColName: [],  // 序列对应的字段名
      chartList: [],
      chartSelectorVisible: false,
      chartMenuVisible: false,
      chartMenuPosition: {
        top: '12px',
        zIndex: 1
      },
    }
  },
  created() {
    this.progressMsg = ''
    this.chartList = defaultChartList
  },
  mounted() {
    console.log('--mounted--')
    if (this.defaultOptions.series.length === 0) {
      this.progressMsg = '没有配置序列（series）'
      return
    }
    this.buildCitiesPositinData(cities, china)

    // GraphView渲染的时候initData可能还没请求到
    if (this.initData && this.initData.length > 0) {
      this.initialize()
    }
  },
  computed: {
    defaultOptions() {
      return this.initOptions && this.initOptions.charts
    },
    initDataUpdate: function() {
      return this.initData
    }
  },
  watch: {
    initDataUpdate: function() {
      if (this.defaultOptions.series.length > 0) {
        this.initialize()
      }
    }
  },
  methods: {
    initialize(){
      this.progressMsg = ''
      this.formatInitData()
      this.showChart(this.defaultOptions.type)
      this.chartSelectorVisible = this.initVisible
    },
    changeChartType(val){
      this.defaultOptions.type = val
      this.showChart(val)
    },
    showChart(type) {
      this.progressMsg = ''
      switch(type) {
        case 'table':
          this.getTableChart()
          break
        case 'line':
          this.options = this.getLineChart()
          break
        case 'lineArea':
          this.options = this.getLineAreaChart()
          break
        case 'bar':
          this.options = this.getBarChart()
          break
        case 'stackbar':
          this.options = this.getStackBarChart()
          break
        case 'verticalbar':
          this.options = this.getVerticalBarChart()
          break
        case 'pie':
          this.options = this.getPieChart()
          break
        case 'pieNdgr':
          this.options = this.getPieNdgrChart()
          break
        case 'radar':
          this.options = this.getRadarChart()
          break
        case 'funnel':
          this.options = this.getFunnelChart()
          break
        case 'scatter':
          this.options = this.getScatterChart()
          break
        case 'treemap':
          this.options = this.getTreemapChart()
          break
        case 'gauge':
          this.options = this.getGaugeChart()
          break
        case 'wordCloud':
          this.options = this.getWordCloudChart()
          break
        case 'map':
          this.options = this.getMapChart()
          break
        case 'heatmap':
          this.options = this.getHeatmapChart()
          break
        case 'graph':
          this.options = this.getGraphChart()
          break
        default:
          console.log(type + '暂时不在支持类型列表')
          this.progressMsg = type + '暂时不在支持类型列表'
      }
    },
    updateChartsMenu({position, visible, current}) {
      if (position !== undefined) {
        console.log("---position---" ,position)
      } else if (visible !== undefined) {
        this.chartMenuVisible = visible
      } else if (current !== undefined) {
        this.changeChartType(current)
      }
    },
    getValueFromUnknown(str) {
      return str ? str : "";
    },
    doMatrixTransposition(array) {
      // 矩阵转置
      let dstData = []
      if (array[0] instanceof Array) {
        const length = array[0].length
        for (let i=0; i<length; i++) {
          dstData.push([])
        }

        for (let i=0; i<array.length; i++) {
          for (let j=0; j<array[i].length; j++) {
            dstData[j][i] = array[i][j]
          }
        }
      } else {
        array.forEach(e => {
          dstData.push([e])
        })
      }

      return dstData
    },
    buildCitiesPositinData(cities,china) {
      // 构建全国主要城市省份与其坐标对应的对象
      cities.features.forEach(city => {
        this.citiesData[city.properties.name] = city.properties.cp
      })
      china.features.forEach(province => {
        this.citiesData[province.properties.name] = province.properties.cp
      })
    },
    formatInitData() {
      // 数据库查出来的数据字段依然是ename
      // 此处统一以前端页面配置的别名来进行替换，方便后续图例等组件的显示
      let aliasMap = {}
      this.seriesColName = []
      this.defaultOptions.series.forEach(serieObj => {
        aliasMap[serieObj.dataCol.ename] = serieObj.cname
        aliasMap[serieObj.cname] = serieObj.dataCol.ename
        this.seriesColName.push(serieObj.cname)
      })
      // 添加x轴的
      const xAxisObj = this.defaultOptions.xAxis
      aliasMap[xAxisObj.dataCol.ename] = xAxisObj.name

      // initData是[{k1:v1,k2:v2...},{k1:v3,k2:v4...}...]格式
      // yAxisDataObj需要是{
      //    k1: [v1, v2, v3...],
      //    k2: [v1, v2, v3...],
      //    ...
      // }
      this.xAxisData = []
      this.yAxisDataObj = {}
      this.initData.forEach(data => {
        // 获取x轴字段对应的值域
        this.xAxisData.push(data[xAxisObj.dataCol.ename])
        // 获取y轴地段对应的值域
        this.seriesColName.forEach(cname => {
          const ename = aliasMap[cname]
          if (this.yAxisDataObj[cname]) {
            this.yAxisDataObj[cname].push(data[ename])
          } else {
            this.yAxisDataObj[cname] = []
            this.yAxisDataObj[cname].push(data[ename])
          }
        })
      })
    },
    buildBaseOptions(axis = false) {
      let baseOptions = {
        color: [
          "#19d4ae",
          "#5ab1ef",
          "#fa6e86",
          "#ffb980",
          "#0067a6",
          "#c4b4e4",
          "#d87a80",
          "#9cbbff",
          "#d9d0c7",
          "#87a997",
          "#d49ea2",
          "#5b4947",
          "#7ba3a8"
        ], // 全局颜色盘
        title: {
          x: "25%",
          text: this.getValueFromUnknown(this.defaultOptions.title.text),
          textStyle: {
            color: "#333",
            fontStyle: "normal",
            fontWeight: "bolder",
            fontFamily: "sans-serif",
            fontSize: 18
          },
          subtext: this.getValueFromUnknown(this.defaultOptions.title.subtext),
          subtextStyle: {
            color: "#aaa",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12
          }
        },
        legend: {
          show: this.defaultOptions.legend.show,
          z: 10,
          orient: "vertical",
          left: "0%",
          textStyle: {
            color: "#333",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12
          },
          // data: this.defaultOptions.legend.data  // 会影响部分图的图例显示
        },
        toolbox: {
          z: 10,
          feature: {
            mark: { show: false }, //   辅助线
            // dataView: { show: true, readOnly: false }, // 使用dataset会导致其显示异常，echarts的bug
            // dataZoom: { show: false }, //添加后导致y轴没有自适应
            // magicType: { show: false, type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: "15%",
          bottom: "10%",
          containLabel: true
        }
      }

      //  没有类目坐标轴的不需要dataZoom组件
      if (axis) {
        baseOptions.dataZoom = [{
          type: "slider",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: this.defaultOptions.dataZoomEnd
        },{
          type: "slider",
          show: true,
          yAxisIndex: [0],
          start: 0,
          end: this.defaultOptions.dataZoomEnd
        }]
      }

      return baseOptions
    },
    buildXAxisAttr(gapVal = false) {
      return {
        name: this.getValueFromUnknown(this.defaultOptions.xAxis.name),
        type: "category",
        boundaryGap: gapVal,
        axisLabel: {
          rotate: this.defaultOptions.xAxis.rotate,
          margin: 5,
          interval: 0
        },
        axisTick: {
          interval: 0
        },
        data: this.xAxisData
      };
    },
    buildYAxisAttr() {
      return {
        name: this.getValueFromUnknown(this.defaultOptions.yAxis.name),
        type: "value"
      };
    },
    buildTooltipAttr(val) {
      return {
        show: this.defaultOptions.tooltip.show,
        trigger: val // 无类目轴的建议使用item，有类目轴的建议使用axis
      };
    },
    buildMarkLine(singleSerie) {
      let data = []
      if (singleSerie.average === true) {
        data.push({
          symbol: 'none',
          type: 'average',
          name: '平均值',
          label: {
            formatter: '平均值 {c}'
          }
        })
      }
      return {'data': data}
    },
    buildMarkPoint(singleSerie) {
      let data = []
      let ret = {}
      if (singleSerie.max === true || singleSerie.min === true) {
        ret = {
          symbol: 'pin',
          symbolSize: 30,
          label: {
            show: true,
            position: 'right'
          }
        }
      }

      if (singleSerie.max === true) {
        data.push({
          label: {
            formatter: '最大值 {c}'
          },
          type: 'max',
          name: '最大值'
        })
      }

      if (singleSerie.min === true) {
        data.push({
          label: {
            formatter: '最小值 {c}'
          },
          type: 'min',
          name: '最小值'
        })
      }
      ret['data'] = data

      return ret
    },
    getDefaultSerieData() {
      // 默认只获取第1个序列的数据
      const xAxisEname = this.defaultOptions.xAxis.dataCol.ename
      const serieEname = this.defaultOptions.series[0].dataCol.ename
      let defaultData = []
      this.initData.forEach(data => {
        defaultData.push({name: data[xAxisEname], value: Number(data[serieEname])})
      })

      return defaultData
    },
    // line
    buildLineSeries(isLineArea) {
      let serieArray = [];
      this.defaultOptions.series.forEach(singleSerie => {
        let serieObj = {
          name: singleSerie.cname,
          symbolSize: 8,
          type: 'line',
          data: this.yAxisDataObj[singleSerie.cname]
        }
        if (isLineArea) {
          serieObj.stack = 'total'
          serieObj.areaStyle = {}
        } else {
          serieObj.markLine = this.buildMarkLine(singleSerie)
          serieObj.markPoint = this.buildMarkPoint(singleSerie)
        }
        serieArray.push(serieObj)
      })
      return serieArray;
    },
    getLineChart(isLineArea = false) {
      // 生成折线图
      let option
      if (isLineArea) {
        // 堆叠图使用zoom会使图形变得不好理解
        option = this.buildBaseOptions(false);
      } else {
        option = this.buildBaseOptions(true);
      }
      option.xAxis = this.buildXAxisAttr();
      option.yAxis = this.buildYAxisAttr();
      option.tooltip = this.buildTooltipAttr("axis");
      option.series = this.buildLineSeries(isLineArea);

      return option;
    },
    getLineAreaChart() {
      return this.getLineChart(true);
    },
    // bar
    buildBarSeries(type) {
      let serieArray = [];
      this.defaultOptions.series.forEach(singleSerie => {
        let serieObj = {
          name: singleSerie.cname,
          type: 'bar',
          data: this.yAxisDataObj[singleSerie.cname]
        }
        if (type === 'stackbar') {
          serieObj.stack = 'total'
        } else if (type === 'bar') {
          serieObj.markLine = this.buildMarkLine(singleSerie)
          serieObj.markPoint = this.buildMarkPoint(singleSerie)
        }
        serieArray.push(serieObj)
      })
      return serieArray;
    },
    getBarChart(type = 'bar') {
      let option
      if (type === 'stackbar') {
        // 堆叠图使用zoom会使图形变得不好理解
        option = this.buildBaseOptions(false);
      } else {
        option = this.buildBaseOptions(true);
      }

      if (type === 'verticalbar') {
        option.xAxis = this.buildYAxisAttr();
        option.yAxis = this.buildXAxisAttr(true);
      } else {
        option.xAxis = this.buildXAxisAttr(true);
        option.yAxis = this.buildYAxisAttr();
      }

      option.tooltip = this.buildTooltipAttr('axis');
      option.tooltip.axisPointer = { type: 'shadow' };
      option.series = this.buildBarSeries(type);

      return option;
    },
    getVerticalBarChart() {
      return this.getBarChart("verticalbar");
    },
    getStackBarChart() {
      return this.getBarChart("stackbar");
    },
    // pie
    buildPieData() {
      // 多个series的话，暂时只处理第一个series
      const nameKey = this.defaultOptions.xAxis.dataCol.ename
      const valueKey = this.defaultOptions.series[0].dataCol.ename
      let data = []
      this.initData.forEach(childData =>{
        data.push({
          "name": childData[nameKey],
          "value": childData[valueKey]
        })
      })

      return data
    },
    buildPieSeries(isRose) {
      let serie = {
        name: this.defaultOptions.series[0].cname,
        type: "pie",
        radius: "75%",
        center: ["50%", "60%"],
        selectedMode: "single",
        data: this.buildPieData(),
        label: {
          fontSize: 14
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }

      };

      if (isRose) {
        serie.radius = ["15%", "75%"];
        serie.roseType = "area";
      }
      return [serie];
    },
    getPieChart(isRose = false) {
      let option = this.buildBaseOptions();
      option.tooltip = this.buildTooltipAttr("item");
      option.tooltip.formatter = "{a} <br/>{b} : {c} ({d}%)";
      option.series = this.buildPieSeries(isRose);

      return option;
    },
    getPieNdgrChart() {
      return this.getPieChart(true);
    },
    // radar
    buildRadarAndSeries(option) {
      // 几组数据就是几边形
      if (this.seriesColName.length < 3) {
        console.log("radar对应的series数据少于3组，显示会不正常")
      }

      let dataKey = this.xAxisData
      let dataValue = []
      this.initData.forEach(data => {
        let values = []
        this.defaultOptions.series.forEach(serieObj => {
          values.push(data[serieObj.dataCol.ename])
        })
        dataValue.push(values)
      })

      let maxArray = [] // 每种类型数据的最大值
      const newArray = this.doMatrixTransposition(dataValue)
      newArray.forEach(array => {
        const maximum = Math.max(...array)
        maxArray.push((parseInt(maximum / 10) + 1) * 10)  // 希望最外层的标度是10的整数倍
      })
      maxArray = this.doMatrixTransposition(maxArray)

      // 组装indicator雷达指示器属性
      let indicator = []
      for (let i=0; i<this.seriesColName.length; i++) {
        indicator.push({name: this.seriesColName[i], max: maxArray[i]})
      }
      option.radar = {}
      option.radar.indicator = indicator

      // 组装series
      let serieObj = {}
      let data = []
      for (let i=0; i<dataKey.length; i++) {
        data.push({name: dataKey[i], value: dataValue[i]})
      }
      serieObj.type = 'radar'
      serieObj.data = data
      option.series = serieObj

      return option
    },
    getRadarChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr("item")
      option = this.buildRadarAndSeries(option)
      console.log(option)
      return option;
    },
    // funnel
    buildFunnelSeries(){
      return [{
        name: this.defaultOptions.series[0].cname,
        type: 'funnel',
        sort: 'descending',
        maxSize: '90%',
        gap: 2,
        label: {
          position: 'inside',
        },
        emphasis: {
          label: {
            textStyle: {
              fontSize: 18
            }
          }
        },
        data: this.getDefaultSerieData()
      }]
    },
    getFunnelChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.series = this.buildFunnelSeries()
      option.tooltip.formatter = '{a}-{b}: {c} ({d}%)'

      return option
    },
    // scatter
    buildScatterData(colName) {
      let data = []
      const yAxisData = this.yAxisDataObj[colName]
      for (let i=0; i<this.xAxisData.length; i++) {
        data.push([this.xAxisData[i], yAxisData[i]])
      }
      return data
    },
    buildScatterSeries() {
      const len = this.seriesColName.length;
      let series = [];
      this.seriesColName.forEach(colName => {
        let serie = {
          symbolSize: 15,
          type: 'scatter'
        }
        serie.data = this.buildScatterData(colName)
        series.push(serie)
      })
      return series;
    },
    getScatterChart() {
      // @todo 需要后续优化显示的方式
      let option = this.buildBaseOptions()
      option.xAxis = this.buildXAxisAttr();
      option.yAxis = this.buildYAxisAttr();
      option.tooltip = this.buildTooltipAttr('item')
      option.series = this.buildScatterSeries()

      return option
    },
    // treemap
    buildTreemapLevelOption() {
      return [{
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 1,
            gapWidth: 1
          }
        },
        upperLabel: {
          normal: {
            show: false
          }
        }
      },{
        itemStyle: {
          normal: {
            borderColor: '#555',
            borderWidth: 5,
            gapWidth: 1
          },
          emphasis: {
              borderColor: '#888'
          }
        }
      },{
        colorSaturation: [0.35, 0.5],
        itemStyle: {
            normal: {
                borderWidth: 5,
                gapWidth: 1,
                borderColorSaturation: 0.6
            }
        }
      }]
    },
    buildTreemapSeriesData() {
      let dstData = []
      Object.keys(this.yAxisDataObj).forEach(seriesCname => {
        let sum = 0
        let data = {}
        data.name = seriesCname
        const srcData = this.yAxisDataObj[seriesCname]
        data.children = []
        for (let i=0; i<srcData.length; i++) {
          let child = {}
          child.name = this.xAxisData[i]
          child.value = Number(srcData[i])

          sum += child.value
          data.children.push(child)
        }
        data.value = sum
        dstData.push(data)
      })

      return dstData
    },
    buildTreemapSeries(option) {
      let serie = {}
      serie.name = 'root'
      serie.type = 'treemap'
      serie.upperLabel = {
        show: true,  // 省略不写会显示异常
        height: 30
      }
      serie.levels = this.buildTreemapLevelOption()
      serie.data = this.buildTreemapSeriesData()

      return [serie]
    },
    getTreemapChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.series = this.buildTreemapSeries(option)

      return option
    },
    // guage
    buildGuageSeries() {
      // 默认只会处理第一个系列
      const xAxisEname = this.defaultOptions.xAxis.dataCol.ename
      const serieEname = this.defaultOptions.series[0].dataCol.ename

      let serie = {
        name: this.defaultOptions.xAxis.name + ' : ' + this.defaultOptions.series[0].cname,
        type: 'gauge',
        title: {
          show: false
        },
        detail: {
          show: false
        }
      }

      let tmpData = []
      let serieData = []
      this.initData.forEach(data => {
        serieData.push({name: data[xAxisEname], value: Number(data[serieEname])})
        tmpData.push(Number(data[serieEname]))
      })
      serie.data = serieData

      let min = Math.min(...tmpData)
      let max = Math.max(...tmpData)

      // 用于推测仪表盘上下限的数值
      if (min === max) {  // 说明只有一组数据
          if (max > 0) {
            min = 0
          } else {
            min -= 10
            max += 10
          }
      } else if (min > 0){
          max = (parseInt(max / 10) + 1) * 10
          min = 0
      } else {
          max = (parseInt(max / 10) + 1) * 10
          min = (parseInt(min / 10) -1) * 10
      }
      serie.min = min
      serie.max = max

      return [serie]
    },
    getGaugeChart() {
      // 多于1个系列，默认只显示第1个
      let option = this.buildBaseOptions()
      option.legend.show = false
      option.tooltip = this.buildTooltipAttr('item')
      option.tooltip.formatter = "{a} <br/>{b} : {c}"
      option.series = this.buildGuageSeries()

      return option
    },
    // wordCloud
    buildWordCloudTextStyle() {
      return {
        normal: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160 + 60),
              Math.round(Math.random() * 160 + 60),
              Math.round(Math.random() * 160 + 60)
            ].join(',') + ')'
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#888'
        }
      }
    },
    buildWordCloudSeries() {
      let serieObj = {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '70%',
        height: '80%',
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 20,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: this.buildWordCloudTextStyle()
      }

      // 只使用第1个的序列的数据
      serieObj.data = this.getDefaultSerieData()

      return [serieObj]
    },
    getWordCloudChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.series = this.buildWordCloudSeries()

      return option
    },
    // map
    buildMapSeries() {
      let serieObj = {
        type: 'map',
        roam: true,
        mapType: 'china',
        selectedMode: 'single',
        label: {
          show: true
        },
        itemStyle: {
          show: true
        },
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            show: true
          }
        }
      }

      // 只使用第1个的序列的数据
      serieObj.data = this.getDefaultSerieData()

      return serieObj
    },
    getMapChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.tooltip.formatter = '{b} : {c}'
      option.series = this.buildMapSeries()

      return option
    },
    // heatmap
    buildHeatmapGeo() {
      return {
        map: "china",
        roam: true,
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#323c48',
          borderColor: '#111'
        },
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            areaColor: '#2a333d'
          }
        }
      }
    },
    buildHeatmapVisualMap() {
      return {
        show: true,
        min: 0,
        max: 200,
        calculable: true,
        inRange: {
          color: ['#74add1', '#95f3f7', '#a3ffc7', '#cdfd95', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        textStyle: {
          color: '#fff'
        }
      }
    },
    buildHeatmapSeries(visualMap) {
      // 只使用第1个的序列的数据
      const srcData = this.getDefaultSerieData()
      let serieObj = {
        type: 'heatmap',
        coordinateSystem: 'geo',
        itemStyle: {color: '#fff'}
      }
      serieObj.data = []
      let maxArray = []
      srcData.forEach(data => {
        let geoCoord = this.citiesData[data.name]
        if (geoCoord !== undefined) {
          serieObj.data.push(geoCoord.concat(data.value))
          maxArray.push(data.value)
        }
      })

      if (serieObj.data.length === 0) {
        return []
      }

      let maxNum = Math.max(...maxArray)
      let length = 1
      for (length; length<10; length++) {
        maxNum = Math.ceil(maxNum / 10)
        if (maxNum <= 10) {
          break
        }
      }
      visualMap.max = maxNum * (10**length)

      return [serieObj]
    },
    getHeatmapChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.visualMap = this.buildHeatmapVisualMap()
      option.geo = this.buildHeatmapGeo()
      option.series = this.buildHeatmapSeries(option.visualMap)

      return option
    },
    // table
    getTableChart() {
      this.tableData = []
      this.tableCol = []
      this.tableCol.push(this.defaultOptions.xAxis.name, ...Object.keys(this.yAxisDataObj))

      const length = this.xAxisData.length
      for (let i=0; i<length; i++) {
        let row = {}
        this.tableCol.forEach(xColCname => {
          if (xColCname === this.defaultOptions.xAxis.name) {
            row[xColCname] = this.xAxisData[i]
          } else {
            row[xColCname] = this.yAxisDataObj[xColCname][i]
          }
        })
        this.tableData.push(row)
      }
    },
    buildGraphLinks(dataLength) {
      let links = []
      for (let i=0; i< dataLength - 1; i++) {
        links.push({source: i, target: i+1})
      }

      return links
    },
    buildGraphSeries(option) {
      let series = []
      Object.keys(this.yAxisDataObj).forEach(serieCname => {
        let serie = {}
        serie.name = serieCname
        serie.type = 'graph'
        serie.layout = 'none'
        serie.coordinateSystem = 'cartesian2d'
        serie.symbolSize = 20
        serie.edgeSymbol = ['circle', 'arrow']
        serie.edgeSymbolSize = [4, 10]
        serie.data = this.yAxisDataObj[serieCname]
        serie.links = this.buildGraphLinks(serie.data.length)

        series.push(serie)
      })

      return series
    },
    getGraphChart() {
      let option = this.buildBaseOptions()
      option.tooltip = this.buildTooltipAttr('item')
      option.xAxis = this.buildXAxisAttr()
      option.xAxis.data = this.xAxisData
      option.yAxis = this.buildYAxisAttr()
      option.series = this.buildGraphSeries(option)

      return option
    }
  }
};
</script>

<style>
.graphView {
  min-width: 600px;
  min-height: 600px;
  width: 100%;
  height: 100%;
}

.echarts {
  width: 100% !important;
  height: 100% !important;
  min-width: 600px;
  min-height: 600px;
}

.warningInfo {
  background-color: rgba(216, 216, 216, 0.4);
  font-size: 20px;
  color: #ababab;
  text-align: center;
  padding-top: 100px;
}

.selector-fade-enter-active {
  transition: all .5s ease;
  opacity: 0;
}
</style>
