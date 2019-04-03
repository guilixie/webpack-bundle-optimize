import { setOuts } from './index'
import store from '../views/flowshow/store'

export default function (state, activeNode) {
  /* 根据不同code，节点属性不同 */
  switch (activeNode.nodeCode) {
    case 'MODEL':
      // 模型节点(战法)
      activeNode.nodeType = 'MX-ZF'
      activeNode.option.relations = []
      break
    case 'MODEL-ML':
      // 模型节点(机器学习)
      activeNode.nodeType = 'MX-ML'
      activeNode.option.outNodeId = ''
      activeNode.option.analyzeResult = { querySql: '', countSql: '' }
      // 更新机器学习模型的数据库信息
      const modelId = activeNode.nodeId.split('_')[0]
      const target = state.models.find(model => model.id === modelId)
      store.commit('vmp/updateActiveModelBasicInfo', { dbId: target.dbId })
      break
    case 'ZJ-102101':
      // 数据处理-数据过滤
      activeNode.option.filters = []
      break
    case 'ZJ-102103':
      // 数据处理-数据关联
      activeNode.option.joinsT = 'INNER_JOIN'
      activeNode.option.joinsC = []
      break
    case 'ZJ-102104':
      // 数据处理-数据分组
      activeNode.option.groups = []
      activeNode.option.aggres = []
      activeNode.option.haves = []
      break
    case 'ZJ-102105':
      // 数据处理-数据排序
      activeNode.option.orders = []
      break
    case 'ZJ-102106':
      // 数据处理-查询界限
      activeNode.option.limit = '1'
      break
    case 'ZJ-103101':
    case 'ZJ-103102':
      // 数据可视化-列表 / 图形
      if (activeNode.nodeCode === 'ZJ-103102') {
        activeNode.option.charts = {
          type: 'bar',
          title: {
            text: '',
            subtext: ''
          },
          dataZoomEnd: 100,
          tooltip: {
            show: false
          },
          legend: {
            show: false,
            data: []
          },
          xAxis: {
            rotate: 0,
            name: '',
            dataCol: {}
          },
          yAxis: {
            name: ''
          },
          series: []
        }
      }
      break
    /* case 'ZJ-105101':
      // 机器学习- K均值聚类
      activeNode.option.params = {  }
      break
    case 'ZJ-105102':
      // 机器学习- SVM向量机
      activeNode.option.params = {  }
      break
    case 'ZJ-105103':
      // 机器学习- 随机森林
      activeNode.option.params = {  }
      break
    case 'ZJ-105104':
      // 机器学习- 决策树
      activeNode.option.params = {  }
      break
    case 'ZJ-105105':
      // 机器学习- 关联规则
      activeNode.option.params = {  }
      break
    case 'ZJ-105106':
      // 机器学习- 神经网络
      activeNode.option.params = {  }
      break */
    case 'ZJ-106101':
      // 机器学习（集群）- K均值聚类
      activeNode.option.params = {
        k: 2
      }
      break
    case 'ZJ-106102':
      // 机器学习（集群）- 逻辑回归
      activeNode.option.params = {
        maxIter: 100,
        regParams: '',
        'cross-validate.fold': 3,
        'cross-validate.parallelism': 3
      }
      break
    default:
      break
  }

  // 设置 outs 数组
  setOuts(activeNode, state.activeModel.model.outs)

  return activeNode
}
