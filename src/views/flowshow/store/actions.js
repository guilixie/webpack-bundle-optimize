import Vue from 'vue'
import { Message } from 'element-ui'
import { genLogRecord } from '@/utils/modelUtils'
import API from '@/apis/index'

// 获取分类
const getCates = async ({ state, commit }) => {
  try {
    // 获取所有分类
    const res = await API.getCates()
    if (res.code === 1) {
      let data = res.data
      commit('updateCates', data)
    }
  } catch (e) {
    console.log(e)
  }
}

// 获取模型
const getModels = async ({ state, commit }) => {
  try {
    const res = await API.getModels()
    if (res.code === 1) {
      const data = res.data
      data.forEach(item => {
        Vue.set(item, 'label', item.name)
      })
      commit('updateModels', data)
    }
  } catch (e) {
    console.log(e)
  }
}

// 获取数据源
const getDataSources = async ({ state, commit }) => {
  try {
    // 获取数据源
    const res = await API.getDataSources()
    if (res.code !== 1) {
      commit('updateDataSources', [])
      return
    }
    res.data && commit('updateDataSources', res.data)
  } catch (e) {
    console.log(e)
  }
}

// 初始化关键状态
const initState = async ({ state, commit }) => {
  try {
    await Promise.all([getCates({
      state,
      commit
    }), getModels({
      state,
      commit
    }), getDataSources({
      state,
      commit
    })])
  } catch (e) {
    console.log(e)
  }
}

// 更新模型
const updateModel = async ({
  state,
  getters,
  commit
}, model) => {
  const curNode = state.activeNodePack[model.id]
  const imodel = {
    id: model.id,
    name: model.name,
    categoryId: model.categoryId,
    dbId: model.dbId,
    description: model.description,
    status: model.status,
    createrId: model.createrId,
    type: model.type,
    model: Object.assign({}, model.model, {
      currentNodeId: curNode ? curNode.nodeId : '',
      nodes: getters.nodes,
      connections: getters.connections
    })
  }
  const res = await API.updateModel(imodel)
  return res
}

// 解析模型
const analyseModel = async ({ state, getters, commit }, after) => {
  const activeModelId = state.activeModel && state.activeModel.id
  const curNode = state.activeNodePack[activeModelId]
  const data = {
    id: state.activeModel.id,
    name: state.activeModel.name,
    categoryId: state.activeModel.categoryId,
    dbId: state.activeModel.dbId,
    description: state.activeModel.description,
    status: state.activeModel.status,
    createrId: state.activeModel.createrId,
    type: state.activeModel.type,
    model: {
      ...state.activeModel.model,
      currentNodeId: curNode ? curNode.nodeId : '',
      nodes: getters.nodes,
      connections: getters.connections
    }
  }
  try {
    const res = await API.analyseModel(data)
    if (res.code !== 1) {
      Message.error(`解析模型失败，请核对！`)
      return
    }
    const model = res.data
    // 成功处理
    if (model) {
      const activeNode = model.model.nodes.find(item => item.nodeId === getters.activeNode.nodeId)
      commit('updateModelInfo', model)
      commit('updateNodesPack', {
        isSetActive: true,
        node: activeNode
      })
    }
    // 后续操作
    after && after(model)
  } catch (e) {
    console.log(e)
  }
}

// 运行节点
const runNode = async ({ state, getters, commit }, {
  currentNodeId, // 当前运行节点，必传
  model = state.activeModel, // 如果没传，取当前模型
  runningParams = state.activeModel.model.params, // 运行时参数（如果是模型运行直接取所有，节点运行需要传入）
  needLogger = false, // 是否生成日志
  needResult = true // 是否需要保存结果
}) => {
  const key = model.id === getters.activeModelId ? model.id : `${getters.activeModelId}_${model.id}`
  // 缓存此次节点运行时参数
  commit('updateNodeRuntimeParams', {
    key: `${key}_${currentNodeId}`,
    params: runningParams
  })
  const pageParams = state.resultPageParamsPack[`${key}_${currentNodeId}`] // 分页参数
  const data = {
    imodel: {
      id: model.id,
      name: model.name,
      categoryId: model.categoryId,
      dbId: model.dbId,
      description: model.description,
      status: model.status,
      createrId: model.createrId,
      type: model.type,
      model: {
        ...model.model,
        params: runningParams,
        currentNodeId
      }
    },
    pageParams: {
      pageNum: pageParams.pageNum, // 页号
      pageSize: pageParams.pageSize, // 每页条数
      condition: pageParams.condition, // 查询条件
      orderBy: pageParams.orderBy // 排序
    }
  }
  // 当运行的就是当前打开模型
  if (model.id === getters.activeModelId) {
    data.imodel.model.nodes = getters.nodes
    data.imodel.model.connections = getters.connections
  }

  const currentNode = data.imodel.model.nodes.find(node => node.nodeId === currentNodeId)

  // 判断是否图形节点，图形节点数据不分页
  if (currentNode.nodeCode === 'ZJ-103102') {
    data.pageParams = null
  }

  // 开始运行节点日志记录
  if (needLogger) {
    const logger = genLogRecord('success', `开始运行${currentNode.nodeName}`)
    commit('updateRunLogRecords', logger)
  }

  try {
    commit('updateRunLoadingPack', { key: `${key}_${currentNodeId}`, loading: true })
    const res = await API.runModel(data)
    commit('updateRunLoadingPack', { key: `${key}_${currentNodeId}`, loading: false })
    if (res.code !== 1) throw new Error(`错误码：${res.code}`)
    console.log(res)
    // 处理运行成功日志
    needLogger && commit('updateRunLogRecords', genLogRecord('success', `运行成功`))
    // 保存结果
    needResult && commit('updateRunResultPack', { key: `${key}_${currentNodeId}`, res: res.data })
    return res
  } catch (e) {
    commit('updateRunLoadingPack', { key: `${key}_${currentNodeId}`, loading: false })
    console.log(e)
    // 处理运行错误日志
    needLogger && commit('updateRunLogRecords', genLogRecord('error', `运行出错<br>${e.message}`))
    // 清除原先结果
    needResult && commit('updateRunResultPack', { key: `${key}_${currentNodeId}`, res: null })
    return Promise.reject(e)
  }
}

// 运行模型
const runModel = async ({ state, getters, commit }, {
  currentNodeIds,
  model,
  runningParams,
  needLogger,
  needResult
}) => {
  const runNodes = currentNodeIds.map(currentNodeId => runNode({ state, getters, commit }, {
    currentNodeId,
    model,
    runningParams,
    needLogger,
    needResult
  }))
  const res = await Promise.all(runNodes)
  return res
}

export default {
  getCates, // 获取分类
  getModels, // 获取模型
  getDataSources, // 获取数据源
  initState, // 初始化关键状态
  updateModel, // 更新模型
  analyseModel, // 分析模型
  runNode, // 运行节点
  runModel // 运行模型
}
