export default class Model {
  constructor () {
    this.id = '' // 模型Id
    this.name = '' // 模型名称
    this.createrId = '' // 创建者
    this.categoryId = '' // 模型分类Id
    this.dbId = '' // 选择数据库
    this.description = '' // 使用说明
    this.status = '0' // 状态
    this.type = '' // 模型类型，MODEL or ZHANFA or SPARK
    this.model = {
      connections: [],
      currentNodeId: '',
      nodes: [],
      outs: [],
      params: []
    } // 模型相关配置项
  }
}
