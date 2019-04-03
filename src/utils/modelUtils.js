/**
 * 分析节点
 * res = {
 *   runtimeNodeIds: [], // 配置存放有运行时参数的 nodeId
 *   invalidNodeIds: [] // 配置存放不可用节点的 nodeId
 *}
 */
export const analyseNodes = (nodeIds, nodes, res) => {
  // 需要判断有运行时参数的 nodeCode：过滤、分组
  const hasRuntimeCodes = ['ZJ-102101', 'ZJ-102104']
  const nodeMap = nodes.reduce((acc, node) => {
    acc[node.nodeId] = node
    return acc
  }, {})
  nodeIds && nodeIds.forEach(id => {
    let node = nodeMap[id]
    let code = node.nodeCode
    let isValid = node.option.isValid
    // 是否是有可能有运行时参数
    res.runtimeNodeIds &&
      hasRuntimeCodes.includes(code) &&
      res.runtimeNodeIds.push(node.nodeId)
    // 是否无效
    res.invalidNodeIds && !isValid && res.invalidNodeIds.push(node.nodeId)
    // 递归
    analyseNodes(node.parents, nodes, res)
  })
}

// 修改父节点，使子节点无效
export const setChildrenInvalid = (nodes, id, flag) => {
  for (let j = nodes.length - 1; j >= 0; j--) {
    let node = nodes[j]
    let nodeId = node.nodeId
    let isOut = node.isOut
    if (node.parents.includes(id)) {
      node.option.isValid = !flag
      const arr = nodes.concat()
      arr.splice(j, 1)
      !isOut && setChildrenInvalid(arr, nodeId, flag)
    }
  }
}

// 验证字段是否属于选项中
export const isColsInside = (cols, optKeys) => {
  for (let i = 0; i < cols.length; i++) {
    let item = cols[i]
    if (!optKeys.includes(`${item.table}_${item.ename}`)) {
      return false
    }
  }
  return true
}

function arrayExistInArray (arr, sArr) {
  const [val1, val2] = arr
  for (let i = 0, len = sArr.length; i < len; i++) {
    let [v1, v2] = sArr[i]
    if (v1 === val1 && v2 === val2) return true
  }
  return false
}

// 找出 ename 和 alias 都雷同的字段
export const findEnameAliasDulplicate = (data) => {
  let hasDulplicates = false
  const dulplicateFields = []
  const getKey = item => item.alias // alias 不能一样
  const getField = item => `${item.table}##${item.ename}`
  for (let i = 0, len = data.length; i < len; i++) {
    for (let j = i + 1, l = data.length; j < l; j++) {
      const ikey = getKey(data[i])
      const jkey = getKey(data[j])
      if (ikey === jkey) {
        const ifield = getField(data[i])
        const jfield = getField(data[j])
        const arr = [ifield, jfield]
        !arrayExistInArray(arr, dulplicateFields) && dulplicateFields.push(arr)
        hasDulplicates = true
      }
    }
  }
  return {
    has: hasDulplicates,
    fields: dulplicateFields
  }
}

// 生成雷同字段提醒信息
export const genDulplicateWarning = (dulplicateFields) => {
  return dulplicateFields.map(([item1, item2]) => {
    const arr1 = item1.split('##')
    const arr2 = item2.split('##')
    return `${arr1[1]}（来自表“${arr1[0]}”）和${arr2[1]}（来自表“${arr2[0]}”）`
  }).join('、')
}

// outs数组添加值
export const setOuts = (node, outs = []) => {
  node.isOut && !outs.includes(node.nodeId) && outs.push(node.nodeId)
}

// 生成日志记录
export const genLogRecord = (type = 'success', log = '') => {
  const now = new Date()
  return {
    type: type,
    date: now,
    log
  }
}
