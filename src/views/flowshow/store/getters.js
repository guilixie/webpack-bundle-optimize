import Vue from 'vue'

// 当前模型或战法的“选中节点”
const activeNode = (state, getters) => {
  return state.activeNodePack[getters.activeModelId] || state.defaultNode
}

// 当前“选中节点”的 id
const currentNodeId = (state, getters) => {
  return getters.activeNode ? getters.activeNode.nodeId : ''
}

// 当前模型或战法的“节点”
const nodes = (state, getters) => {
  return state.nodesPack[getters.activeModelId] || []
}

// 当前模型或战法的“连接”
const connections = (state, getters) => {
  return state.connectionsPack[getters.activeModelId] || []
}

// 当前模型或战法的zoom缩放比例
const boardZoom = (state, getters) => {
  return state.boardZoomPack[getters.activeModelId] || state.defaultZoom
}

// 当前模型或者战法是否修改过
const isActiveModelEdit = (state, getters) => {
  return state.isModelEditPack[getters.activeModelId] || false
}

// 当前选中的模型或战法 id
const activeModelId = state => {
  return state.activeModel ? state.activeModel.id : ''
}

// 当前选中的分类 id
const activeCateId = state => {
  return state.activeCate ? state.activeCate.id : ''
}

// 当前选中的数据可视化的tab
const activeDataView = (state, getters) => {
  return state.activeDataViewPack[getters.activeModelId]
}

// 当前选中的数据可视化的tab的分页参数
const activeDataViewParams = (state, getters) => {
  return state.resultPageParamsPack[getters.activeDataView]
}

// 当前选中的数据可视化的tab的后端返回结果 result
const activeDataViewResult = (state, getters) => {
  return state.runResultPack[getters.activeDataView]
}

// 数据源 {id: name} 对应map
const dataSourceMap = state => {
  const obj = {}
  state.dataSources.forEach(item => {
    obj[item.id] = item.name
  })
  return obj
}

// 右侧配置项目标题
const configTitleMap = state => {
  const obj = {}
  state.components.forEach(item => {
    item.children.forEach(v => {
      obj[v.code] = `${item.label} / ${v.label}`
    })
  })
  return obj
}

// 模型分类
const modelCates = state => {
  return genCates(state.categories, 'MODEL')
}

// 战法分类
const zhanfaCates = state => {
  return genCates(state.categories, 'ZHANFA')
}

// 机器学习分类
const sparkCates = state => {
  return genCates(state.categories, 'SPARK')
}

// 普通模型
const normalModels = state => {
  return genModels(state.models, 'MODEL')
}

// 战法
const zhanfaModels = state => {
  return genModels(state.models, 'ZHANFA')
}

// 机器学习
const sparkModels = state => {
  return genModels(state.models, 'SPARK')
}

function genCates (cates, space) {
  return cates.reduce((acc, item) => {
    return item.space === space ? acc.concat([{
      id: item.id,
      name: item.name
    }]) : acc
  }, [])
}

function genModels (models, type) {
  return models.filter(item => item.type === type)
}

function genTree (cates, models) {
  cates.forEach(item => {
    const mds = models && models.filter(v => v.categoryId === item.id)
    let len = mds.length
    item.label = `${item.name}(${len})`
    Vue.set(item, 'children', mds)
  })
  return cates
}

// 根据models和categories构造模型树
const modelTree = state => {
  const modelCates = state.categories.filter(item => item.space === 'MODEL')
  return genTree(modelCates, state.models)
}

// 根据models和categories构造战法树
const zhanfaTree = state => {
  const zhanfaCates = state.categories.filter(item => item.space === 'ZHANFA')
  return genTree(zhanfaCates, state.models)
}

// 根据models和categories构造机器学习树
const sparkTree = state => {
  const sparkCates = state.categories.filter(item => item.space === 'SPARK')
  return genTree(sparkCates, state.models)
}

const cateMap = (state, getters) => {
  const obj = {}
  state.categories.forEach(item => {
    obj[item.id] = item
  })
  return obj
}

const cateNameMap = (state, getters) => {
  const obj = {}
  state.categories.forEach(item => {
    obj[item.id] = item.name
  })
  return obj
}

const modelNameMap = state => {
  const obj = {}
  state.models.forEach(item => {
    obj[item.id] = item.name
  })
  return obj
}

const modelMap = state => {
  const obj = {}
  state.models.forEach(item => {
    obj[item.id] = item
  })
  return obj
}

const nodeMap = (state, getters) => {
  const obj = {}
  getters.nodes.forEach(item => {
    obj[item.nodeId] = item
  })
  return obj
}

const nodeNameMap = (state, getters) => {
  return getters.nodes.reduce((acc, item) => {
    acc[item.nodeId] = item.nodeName
    return acc
  }, {})
}

const nodeColumnsMap = (state, getters) => {
  return getters.nodes.reduce((acc, item) => {
    acc[item.nodeId] = item.option && item.option.columns
    return acc
  }, {})
}

const activeNodeOldOption = (state, getters) => {
  return state.nodeOldOptionPack[`${getters.activeModelId}_${getters.currentNodeId}`]
}

const activeNodePrevOption = (state, getters) => {
  return state.nodePrevOptionPack[`${getters.activeModelId}_${getters.currentNodeId}`]
}

const activeModelLogs = (state, getters) => {
  return state.runLogRecords[getters.activeModelId] || []
}

const activeModelErrorCount = (state, getters) => {
  return getters.activeModelLogs.filter(item => item.type === 'error').length
}

export default {
  activeNode, // 当前模型或战法的“选中节点”
  currentNodeId, // 当前“选中节点”的 id
  nodes, // 当前模型或战法的“节点”
  connections, // 当前模型或战法的“连接”
  boardZoom, // 当前模型或战法的zoom缩放比例
  isActiveModelEdit, // 当前模型或者战法是否修改过
  activeModelId, // 当前选中的模型或战法 id
  activeCateId, // 当前选中的分类 id
  dataSourceMap, // 数据源 {id: name} 对应map
  configTitleMap, // 右侧配置项目标题
  modelCates, // 模型分类
  zhanfaCates, // 战法分类
  sparkCates, // 机器学习分类
  normalModels, // 普通模型
  zhanfaModels, // 战法
  sparkModels, // 机器学习
  modelTree, // 模型树
  zhanfaTree, // 战法树
  sparkTree, // 机器学习树
  cateMap, // 根据id获取分类
  cateNameMap, // 根据id获取分类名
  modelNameMap, // 根据id获取模型名
  modelMap, // 根据id获取模型数据
  nodeMap, // 根据id获取节点数据
  nodeNameMap, // 根据id获取节点名称
  nodeColumnsMap, // 根据id获取节点字段
  activeDataView, // 当前选中的数据可视化的tab
  activeDataViewParams, // 当前选中的数据可视化的tab的分页参数
  activeDataViewResult, // 当前选中的数据可视化的tab的后端返回结果 result
  activeModelLogs, // 当前模型的日志记录
  activeModelErrorCount, // 当前模型的错误日志记录提醒
  activeNodeOldOption, // 当前节点缓存的 option
  activeNodePrevOption // 当前节点缓存的最近一次option
}
