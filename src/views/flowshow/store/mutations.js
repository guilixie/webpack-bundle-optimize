import Vue from 'vue'
import Node from '@/utils/node'
import Model from '@/utils/model'
import getNodeOptionByCode from '@/utils/getOption'
import cloneDeep from 'lodash/cloneDeep'

const updateBoardArea = (state, val) => {
  // 更新设计板尺寸信息
  state.boardArea = val
}
const updateCates = (state, categories) => {
  // 更新分类列表
  state.categories = categories
}
const findOneCate = (state, id) => {
  return state.categories.findIndex(val => val.id === id)
}
const addOneCate = (state, cate) => {
  state.categories.push(cate)
}
const updateOneCate = (state, cate) => {
  const idx = findOneCate(state, cate.id)
  state.categories.splice(idx, 1, {...cate})
}
const deleteOneCate = (state, id) => {
  const idx = findOneCate(state, id)
  state.categories.splice(idx, 1)
}
const deleteCateModels = (state, id) => {
  state.models = state.models.filter(val => val.categoryId !== id)
}
const updateModels = (state, models) => {
  // 更新模型列表
  state.models = models
}
const findOneModel = (state, id) => {
  return state.models.findIndex(val => val.id === id)
}
const addOneModel = (state, model) => {
  state.models.push(model)
}
const updateOneModel = (state, model) => {
  const idx = findOneModel(state, model.id)
  state.models.splice(idx, 1, { ...model })
}
const deleteOneModel = (state, id) => {
  const idx = findOneModel(state, id)
  state.models.splice(idx, 1)
}
const updateDataSources = (state, datasources) => {
  // 更新数据源列表
  state.dataSources = datasources
}
const pushOpenModels = (state, model) => {
  // 添加模型到“打开的模型数组”
  state.openModels.push(model)
}
const spliceAndReplaceOpenModels = (state, model) => {
  // 替换一个模型的修改后信息
  for (let len = state.openModels.length, i = len - 1; i >= 0; i--) {
    if (state.openModels[i].id === model.id) {
      state.openModels.splice(i, 1, model)
      break
    }
  }
}
const deleteModelFromOpenModels = (state, mIdArr) => {
  // 删除多个打开的模型
  for (let len = state.openModels.length, i = len - 1; i >= 0; i--) {
    if (mIdArr.includes(state.openModels[i].id)) {
      state.openModels.splice(i, 1)
    }
  }
}
const deleteModelAndSelectOther = (state, id) => {
  const openModels = state.openModels
  for (let len = openModels.length, i = len - 1; i >= 0; i--) {
    if (openModels[i].id === id) {
      openModels.splice(i, 1)
      let nextModel = openModels[i] || openModels[i - 1]
      if (nextModel) updateActiveModel(state, nextModel.id)
      else formatActiveModel(state)
      break
    }
  }
}
const deleteCateAndSelectOther = state => {
  const cates = state.categories
  const nextCate = cates.length === 0 ? { id: '', name: '' } : cates[0]
  updateActiveCate(state, nextCate)
}
const updateActiveCate = (state, cate) => {
  state.activeCate = {
    id: cate.id,
    name: cate.name,
    space: cate.space || '',
    status: cate.status || ''
  }
}
const updateOpenModels = (state, models) => {
  // 更新“打开的模型数组”
  state.openModels = models
}
const pushNode = (state, node) => {
  // 组件节点放入当前模型的节点数组
  const target = state.nodesPack[state.activeModel.id]
  if (!Array.isArray(target)) Vue.set(state.nodesPack, state.activeModel.id, [])
  state.nodesPack[state.activeModel.id].push(node)
}
const deleteNode = (state, idx) => {
  // 当前模型的节点数组删除一个组件节点
  state.nodesPack[state.activeModel.id].splice(idx, 1)
}
const pushConnection = (state, connection) => {
  // 连线信息放入当前模型的连线数组
  const target = state.connectionsPack[state.activeModel.id]
  if (!Array.isArray(target)) Vue.set(state.connectionsPack, state.activeModel.id, [])
  state.connectionsPack[state.activeModel.id].push(connection)
}
const deleteConnection = (state, idx) => {
  // 当前模型的连线数组删除一条连线信息
  state.connectionsPack[state.activeModel.id].splice(idx, 1)
}
const updateActiveNode = (state, val) => {
  // 更新当前模型的当前选中节点
  Vue.set(state.activeNodePack, state.activeModel.id, val)
}
const changeNodesPack = (state, { id, nodes }) => {
  Vue.set(state.nodesPack, id, nodes)
}
const updateNodesPack = (state, { isSetActive = false, node = {} } = {}) => {
  // 更新数组中节点的数据
  const id = state.activeModel.id
  const targetNodes = state.nodesPack[id]
  let ret
  for (let i = 0, len = targetNodes.length; i < len; i++) {
    let item = targetNodes[i]
    if (item.nodeId === node.nodeId) {
      item = Object.assign(item, node)
      ret = item
      break
    }
  }
  // 根据标志选择是否更新当前节点
  if (isSetActive) {
    Vue.set(state.activeNodePack, id, ret)
    // 更新model中的currentNodeId
    updateModelInfo(state, {
      id,
      model: {
        currentNodeId: state.activeNodePack[id].nodeId
      }
    })
  }
}
// 设置各模型画板缩放比例
const setZoom = (state, val) => {
  Vue.set(state.boardZoomPack, state.activeModel.id, val)
}
// 当前选中, 如果在“打开的模型数组”中，则打开，否则 push
const currentModelChange = (state, item) => {
  const modelId = item.id
  const category = state.categories.find(v => v.id === item.categoryId)
  let parent = item.$parent || category
  // 判断是否分类
  if (!parent) {
    const cate = state.categories.find(v => v.id === modelId)
    state.activeCate = {
      id: modelId,
      name: cate ? cate.name : '',
      space: cate ? cate.space : '',
      status: cate ? cate.status : ''
    }
    return
  }
  // 初始化
  state.activeCate = {
    id: '',
    name: '',
    space: '',
    status: ''
  }
  const identicalArr = state.openModels.filter(v => v.id === modelId)
  // 如果不在“ 打开的模型数组” 中， 则 push
  if (identicalArr.length === 0) {
    // 打开的模型数组增加一个
    pushOpenModels(state, item)
    // 初始化编辑状态
    changeModelEditedFlag(state, {
      id: modelId,
      flag: false
    })
    // 打开模型时，缓存模型数据
    item.id && updateOldModelPack(state, cloneDeep(item))
    // 打开模型时，缓存所有非输出节点 option 数据
    item.model && item.model.nodes.forEach(node => {
      !node.isOut && updateNodeOldOptionPack(state, {
        modelId: item.id,
        nodeId: node.nodeId,
        opt: cloneDeep(node.option)
      })
    })
  } else {
    spliceAndReplaceOpenModels(state, item)
  }
  updateActiveModel(state, modelId)
}

const updateActiveModelBasicInfo = (state, modelBasicInfo) => {
  state.activeModel = { ...state.activeModel, ...modelBasicInfo }
  spliceAndReplaceOpenModels(state, state.activeModel)
  updateOneModel(state, state.activeModel)
}

const updateActiveModel = (state, modelId) => {
  // 更新当前选中模型
  if (!modelId) return
  state.activeModel = state.models.find(item => item.id === modelId) // ???
  // 需要更新 nodesPack 和 connectionsPack，activeNodePack
  Vue.set(state.activeNodePack, state.activeModel.id, '')
  Vue.set(state.nodesPack, state.activeModel.id, state.activeModel.model ? state.activeModel.model.nodes : [])
  Vue.set(state.connectionsPack, state.activeModel.id, state.activeModel.model ? state.activeModel.model.connections : [])
}
const formatActiveModel = state => {
  // 初始化清空选中模型
  state.activeModel = new Model()
}
const updateActiveModelInfo = (state, modelInfo) => {
  // 更新当前模型的 model 信息
  Vue.set(state.activeModel, 'model', Object.assign({}, state.activeModel.model, modelInfo))
}
const genNodeOfCode = (state, node) => {
  // node具有的公共结构
  const newNode = new Node()
  const activeNode = {
    ...newNode,
    ...node
  }
  // 生成对应node的option
  getNodeOptionByCode(state, activeNode)
  // 更新activeNode
  updateActiveNode(state, activeNode)
  // 放入当前model的节点数组
  pushNode(state, activeNode)
}
const updateModelInfo = (state, model) => {
  // 更新模型的model信息
  const tModel = state.models.find(item => item.id === model.id)
  tModel.model = Object.assign({}, tModel.model, model.model)
}
const changeModelEditedFlag = (state, { id, flag }) => {
  // 更新当前模型的是否编辑过
  state.isModelEditPack[id] = flag
}
const setEditFlagTrue = state => {
  // 当前模型是否已编辑状态置为true
  changeModelEditedFlag(state, {
    id: state.activeModel.id,
    flag: true
  })
}

const updateResultPageParamsPack = (state, { key, params }) => {
  key && Vue.set(state.resultPageParamsPack, key, params)
}
const updateRunResultPack = (state, { key, res }) => {
  key && Vue.set(state.runResultPack, key, res)
}
const updateRunNodeIds = (state, { key = state.activeModel.id, runNodeIds }) => {
  key && Vue.set(state.runNodeIds, key, runNodeIds)
}
const updateActiveDataViewPack = (state, val) => {
  state.activeModel.id && Vue.set(state.activeDataViewPack, state.activeModel.id, val)
}

const updateActiveName = (state, activeName) => {
  // 更新左侧功能区选中
  state.activeName = activeName
}

const deleteRunOldData = (state, modelId = state.activeModel.id) => {
  const currentModel = state.models.find(model => model.id === modelId)
  const modelType = currentModel.type
  const nodes = state.nodesPack[modelId]
  const nodeIds = nodes ? nodes.map(item => item.nodeId) : []
  // 模型
  if (modelType === 'MODEL') {
    // 删除相关 runNodeIds
    delete state.runNodeIds[modelId]
    // 删除相关运行参数
    nodeIds.forEach(id => {
      delete state.resultPageParamsPack[`${modelId}_${id}`]
      delete state.runResultPack[`${modelId}_${id}`]
    })
  } else {
  // 战法或者机器学习
    const modelIds = nodeIds.map(item => item.split('_')[0])
    const modelNodeIds = state.models.reduce((acc, model) => {
      if (modelIds.includes(model.id)) acc[model.id] = model.model.nodes.map(node => node.nodeId)
      return acc
    }, {})
    modelIds.forEach(mId => {
      // 删除相关 runNodeIds
      delete state.runNodeIds[`${modelId}_${mId}`]
      const nIds = modelNodeIds[mId]
      // 删除相关运行参数
      nIds && nIds.forEach(id => {
        delete state.resultPageParamsPack[`${modelId}_${mId}_${id}`]
        delete state.runResultPack[`${modelId}_${mId}_${id}`]
      })
    })
  }
  // 删除当前展示的tab
  delete state.activeDataViewPack[modelId]
}

const updateNodeRuntimeParams = (state, { key, params }) => {
  Vue.set(state.nodeRuntimeParams, key, params)
}

const deteleModelRelationalNodeRuntimeParams = (state, modelId) => {
  Object.keys(state.nodeRuntimeParams).forEach(val => {
    if (modelId === val.split('_')[0]) {
      delete state.nodeRuntimeParams[val]
    }
  })
}

const updateNodeOldOptionPack = (state, { modelId, nodeId, opt }) => {
  Vue.set(state.nodeOldOptionPack, `${modelId}_${nodeId}`, opt)
}

const deleteNodeOldOptionData = (state, modelId) => {
  Object.keys(state.nodeOldOptionPack)
    .filter(key => key.split('_')[0] === modelId)
    .forEach(uniqKey => {
      delete state.nodeOldOptionPack[uniqKey]
    })
}

const updateNodePrevOptionPack = (state, { modelId, nodeId, opt }) => {
  Vue.set(state.nodePrevOptionPack, `${modelId}_${nodeId}`, opt)
}

const deleteNodePrevOptionData = (state, modelId) => {
  Object.keys(state.nodePrevOptionPack)
    .filter(key => key.split('_')[0] === modelId)
    .forEach(uniqKey => {
      delete state.nodePrevOptionPack[uniqKey]
    })
}

const updateOldModelPack = (state, model) => {
  Vue.set(state.oldModelPack, model.id, model)
}

const deleteOldModelData = (state, modelId) => {
  delete state.oldModelPack[modelId]
}

const updateRunLoadingPack = (state, { key, loading }) => {
  Vue.set(state.runLoadingPack, key, loading)
}

const deleteRunLoadingPack = (state, modelId) => {
  Object.keys(state.runLoadingPack)
    .filter(key => key.split('_')[0] === modelId)
    .forEach(uniqKey => {
      delete state.runLoadingPack[uniqKey]
    })
}

const updateRunLogRecords = (state, logger) => {
  const target = state.runLogRecords[state.activeModel.id]
  if (!Array.isArray(target)) Vue.set(state.runLogRecords, state.activeModel.id, [])
  state.runLogRecords[state.activeModel.id].push(logger)
}

const clearRunLogRecords = (state, modelId) => {
  state.runLogRecords[modelId] = []
}

const deleteRunLogRecords = (state, modelId) => {
  delete state.runLogRecords[modelId]
}

export default {
  updateBoardArea, // 更新设计板尺寸信息
  updateModels, // 更新模型列表
  addOneCate, // 新增一个分类
  updateOneCate, // 更新一个分类
  deleteOneCate, // 删除一个分类
  deleteCateModels, // 删除分类下的模型
  addOneModel, // 新增一个模型
  updateOneModel, // 修改一个模型
  deleteOneModel, // 删除一个模型
  updateCates, // 更新分类列表
  updateDataSources, // 更新数据源列表
  pushOpenModels, // 添加模型到“打开的模型数组”
  spliceAndReplaceOpenModels, // 替换一个模型的修改后信息
  deleteModelFromOpenModels, // 删除多个打开的模型
  deleteModelAndSelectOther, // 删除打开的模型，并选中另一个
  deleteCateAndSelectOther, // 删除分类并选中第一个
  updateActiveCate, // 更新选中的分类
  updateOpenModels, // 更新“打开的模型数组”
  pushNode, // 组件节点放入当前模型的节点数组
  deleteNode, // 当前模型的节点数组删除一个组件节点
  pushConnection, // 连线信息放入当前模型的连线数组
  deleteConnection, // 当前模型的连线数组删除一条连线信息
  updateActiveNode, // 更新当前模型的当前选中节点
  changeNodesPack, // 更新nodesPack
  updateNodesPack, // 更新nodesPack（数组中节点的数据）, 并根据标志选择是否更新当前节点
  setZoom, // 设置各模型画板缩放比例
  currentModelChange, // 当前选中, 如果在“打开的模型数组”中，则打开，否则push
  updateActiveModelBasicInfo, // 更新当前模型基本信息，如dbId
  updateActiveModel, // 更新当前选中模型，并更新 nodesPack 和 connectionsPack，activeNodePack
  formatActiveModel, // 初始化清空选中模型
  updateActiveModelInfo, // 更新当前模型的model信息
  genNodeOfCode, // node具有的公共结构，并根据nodeCode生成不同option
  updateModelInfo, // 更新模型数组models中的model信息
  changeModelEditedFlag, // 更新当前模型的是否编辑过
  setEditFlagTrue, // 当前模型是否已编辑状态置为true
  updateResultPageParamsPack, // 更新运行模型或节点列表的参数
  updateRunResultPack, // 更新运行模型或节点列表的返回结果
  updateRunLogRecords, // 更新模型运行日志记录
  clearRunLogRecords, // 清除某个模型的日志记录
  deleteRunLogRecords, // 删除某个模型的日志记录
  updateRunNodeIds, // 更新运行模型或节点的nodeId数组
  updateActiveDataViewPack, // 更新当前模型运行的数据可视化的当前tab
  deleteRunOldData, // 删除运行的旧数据
  updateActiveName, // 更新左侧功能区选中
  updateNodeRuntimeParams, // 更新节点运行时参数
  deteleModelRelationalNodeRuntimeParams, // 删除模型相关的节点运行时参数
  updateNodeOldOptionPack, // 更新缓存的节点配置 option 数据
  deleteNodeOldOptionData, //  删除关闭模型缓存的节点配置 option 数据
  updateNodePrevOptionPack, // 更新缓存的上一次节点配置 option 数据
  deleteNodePrevOptionData, //  删除关闭模型缓存的上一次节点配置 option 数据
  updateOldModelPack, // 更新缓存的模型数据
  deleteOldModelData, //  删除关闭模型缓存的模型数据
  updateRunLoadingPack, // 更新运行结果加载中
  deleteRunLoadingPack // 删除模型相关运行结果加载中
}
