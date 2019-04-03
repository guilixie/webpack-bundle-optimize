import components from '@/utils/components'
import treeIcons from '@/utils/treeIcons'

export default {
  components, // 组件
  iconConfig: treeIcons, // 模型树图标配置
  boardLoading: true, // 模型设计板加载中
  defaultZoom: 1, // 默认缩放比例
  boardZoomPack: {}, // 存放不同模型设计板缩放比例
  boardArea: {
    w: 0, // 宽
    h: 0, // 高
    left: 0, // 离页面左侧距离
    top: 0, // 离页面上侧距离
    scrollLeft: 0, // 水平滚动距离
    scrollTop: 0 // 垂直滚动距离
  }, // 模型设计板的位置尺寸参数
  activeNodePack: {}, // 存放不同模型当前选中的组件节点
  defaultNode: {
    nodeId: '', // 节点唯一uuid，前端生成
    nodeType: 'ZJ', // 节点类型
    nodeName: '', // 节点名称
    nodeCode: '', // 唯一code
    nodeDesc: '', // 节点描述
    positionX: 0, // 在设计画板上位置x
    positionY: 0, // 在设计画板上位置y
    parents: [], // 父节点
    isOut: false, // 是否输出
    option: {
      isValid: false, // 是否合法
      etables: [], // 表格
      columns: [] // 字段
    }
  }, // 默认组件节点信息
  dataSources: [], // 所有数据库
  models: [], // 所有模型
  categories: [], // 所有分类
  activeCate: {
    id: '',
    name: '',
    space: '',
    status: ''
  }, // 当前分类
  activeModel: {
    id: '', // 模型Id
    name: '', // 模型名称
    createrId: '', // 创建者
    categoryId: '', // 模型分类Id
    dbId: '', // 选择数据库
    description: '', // 使用说明
    status: '0', // 状态
    type: 'MODEL', // 模型类型，MODEL or ZHANFA or SPARK
    model: {
      connections: [],
      currentNodeId: '',
      nodes: [],
      outs: [],
      params: []
    }
  }, // 当前模型基本信息
  activeName: 'modelBase', // 当前功能区
  modelTypeOpt: {
    MODEL: '普通模型',
    ZHANFA: '战法',
    SPARK: '机器学习'
  },
  resultPageParamsPack: {}, // 可视化列表参数集合, 对象的key值（模型：modelId_nodeId ；战法：zhanfaId_modelId_nodeId）
  runResultPack: {}, // 运行返回结果集合, 对象的key值（模型：modelId_nodeId； 战法：zhanfaId_modelId_nodeId）
  runLoadingPack: {}, // 运行加载中, 对象的key值（模型：modelId_nodeId； 战法：zhanfaId_modelId_nodeId）
  runLogRecords: {}, // 模型运行日志，对象的key值（模型：modelId）
  runNodeIds: {}, // 运行的节点id数组, 对象的key值（模型：modelId； 战法：zhanfaId_modelId） value值: 运行节点 id数组
  nodeRuntimeParams: {}, // "节点运行"的运行时参数数组, 以model的id和node的id构成key：modelId_nodeId
  activeDataViewPack: {}, // 数据可视化的当前tab, 对象的 key值 activeModelId； value值:（模型：modelId_nodeId ；战法：zhanfaId_modelId_nodeId）
  nodeOldOptionPack: {}, // 缓存当前模型的当前节点的option数据, 以model的id和node的id构成key：modelId_nodeId
  nodePrevOptionPack: {}, // 针对于新增的节点，缓存当前模型的当前节点的上一次配置option数据, 以model的id和node的id构成key：modelId_nodeId
  oldModelPack: {}, // 缓存旧模型的数据
  isModelEditPack: {}, // 标志各模型是否修改过
  openModels: [], // 在设计板上打开的模型数组
  nodesPack: {}, // 存放不同模型组件节点数组
  connectionsPack: {} // 存放不同模型组件节点连接
}
