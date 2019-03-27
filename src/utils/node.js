export default class Node {
  constructor () {
    this.nodeId = '' // 节点唯一uuid，前端生成
    this.nodeType = 'ZJ' // 节点类型
    this.nodeName = '' // 节点名称
    this.nodeCode = '' // 唯一code
    this.nodeDesc = '' // 节点描述
    this.positionX = 0 // 在设计画板上位置x
    this.positionY = 0 // 在设计画板上位置y
    this.parents = [] // 父节点
    this.isOut = false // 是否输出
    this.option = {
      isValid: false, // 是否合法
      etables: [], // 表格
      columns: [] // 字段
    }
  }
}
