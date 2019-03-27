<template>
  <div class="flowchart" :id="containerId">
    <div
      class="node"
      v-for="node in nodes"
      :key="node.nodeId"
      :id="node.nodeId"
      :data-code="node.nodeCode"
      :style="{left: `${node.positionX}px`, top: `${node.positionY}px`, borderColor: iconMap[node.nodeCode] && iconMap[node.nodeCode].color, backgroundColor:  isCurrent(node) ? iconMap[node.nodeCode] && iconMap[node.nodeCode].color : '#fff'}"
      @mousedown.stop.prevent="bindNodeEvt"
    >
      <glyph-icon
        :name="iconMap[node.nodeCode] && iconMap[node.nodeCode].class"
        :color=" isCurrent(node) ? '#fff' :  iconMap[node.nodeCode] && iconMap[node.nodeCode].color "
      />
      <span
        :title="node.nodeName"
        class="node-text"
        :style="{color:  isCurrent(node) ? '#fff' :  iconMap[node.nodeCode] && iconMap[node.nodeCode].color}"
      >{{node.nodeName}}</span>
      <i class="el-icon-warning warning-flag" v-if="node.option && !node.option.isValid"></i>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import uuid from 'uuid'
import jsplumb from 'jsplumb'
import { Message } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('vmp')
const jsPlumb = jsplumb.jsPlumb

export default {
  name: 'FlowChart',
  props: {
    currentNodeId: String, // 当前节点id
    nodes: Array, // 节点数组
    connections: Array // 连接信息数组
  },
  data () {
    return {
      containerId: `jFlowchart_${uuid.v1()}`, // 容器id
      jsplumbInstance: null, // jsplumb实例
      defaultOption: {
        Connector: [
          'Bezier',
          {
            curviness: 30
          }
        ],
        DragOptions: {
          cursor: 'pointer',
          zIndex: 600
        },
        PaintStyle: {
          radius: 5,
          stroke: '#E8C870',
          lineWidth: 1
        },
        EndpointStyle: {
          radius: 2,
          fill: '#E8C870'
        },
        HoverPaintStyle: {
          stroke: '#7073EB'
        },
        EndpointHoverStyle: {
          fill: '#7073EB'
        },
        Container: 'containerId'
      }, // 默认配置
      sEndpoint: {
        paintStyle: { radius: 3, fill: '#D4FFD6' }, // 设置连接点的颜色
        isSource: true, // 是否可以拖动（作为连线起点)
        anchor: [0.5, 1, 0, 0], // 锚点位置
        scope: 'link dot', // 连接点的标识符，只有标识符相同的连接点才能连接
        isTarget: false, // 是否可以放置（作为连线终点）
        maxConnections: 1000 // 设置连接点最多可以连接几条线
      }, // 源端点
      tEndpoint: {
        paintStyle: { radius: 3, fill: '#FF8891' },
        isSource: false,
        anchor: [0.5, 0, 0, 0],
        scope: 'link dot',
        isTarget: true,
        maxConnections: 1,
        onMaxConnections (info) {
          Message({ type: 'error', message: '输入端点只能有一个连接!' })
          console.log(info)
        }
      }, // 目标端点
      anchorsCodeMap: {
        input: ['ZJ-101101', 'ZJ-101102', 'MODEL-ML'],
        output: [
          'ZJ-103101',
          'ZJ-103102',
          'ZJ-105101',
          'ZJ-105102',
          'ZJ-105103',
          'ZJ-105104',
          'ZJ-105105',
          'ZJ-105106',
          'ZJ-105103XX',
          'ZJ-105104xx',
          'ZJ-106101',
          'ZJ-106102'
        ],
        complex: ['ZJ-102103', 'ZJ-102107'],
        default: [
          'ZJ-102101',
          'ZJ-102102',
          'ZJ-102104',
          'ZJ-102105',
          'ZJ-102106',
          'ZJ-102108',
          'ZJ-102109',
          'ZJ-104101',
          'ZJ-104102',
          'ZJ-104103',
          'ZJ-104104',
          'ZJ-104105',
          'ZJ-104106',
          'ZJ-104107',
          'ZJ-104108',
          'MODEL'
        ]
      }, // 四种形式锚点对应nodeCode
      anchorsMap: {
        input: [{ anchor: [0.5, 1, 0, 0, 0, 0], type: 'sEndpoint' }],
        output: [{ anchor: [0.5, 0, 0, 0, 0, 0], type: 'tEndpoint' }],
        complex: [
          { anchor: [0.5, 1, 0, 0, 0, 0], type: 'sEndpoint' },
          { anchor: [0.3333333333333333, 0, 0, 0, 0, 0], type: 'tEndpoint' },
          { anchor: [0.6666666666666666, 0, 0, 0, 0, 0], type: 'tEndpoint' }
        ],
        default: [
          { anchor: [0.5, 1, 0, 0, 0, 0], type: 'sEndpoint' },
          { anchor: [0.5, 0, 0, 0, 0, 0], type: 'tEndpoint' }
        ]
      }, // 锚点根据nodeCode不同有四种形式
      prevModelId: '', // 缓存上次节模型 Id
      prevNodes: [], // 缓存上次节点数组
      endpointPack: {}, // 存放所有节点的端点
      jpConnectionsPack: {}, // 存放所有连接_jp.Connection对象
      isConnectionLoading: false // 是否加载已有连接
    }
  },
  computed: {
    ...mapState(['components', 'boardArea']),
    ...mapGetters(['activeModelId', 'boardZoom']),
    // 是否当前节点
    isCurrent () {
      return node => this.currentNodeId === node.nodeId
    },
    // 图标颜色map
    iconMap () {
      let comps = []
      const ret = {
        MODEL: {
          class: 'glyphicon-object-align-bottom',
          color: '#888888'
        },
        'MODEL-ML': {
          class: 'glyphicon-object-align-bottom',
          color: '#888888'
        }
      }
      this.components.forEach(item => {
        comps = comps.concat(item.children)
      })
      comps.forEach(node => {
        ret[node.code] = node.icon
      })
      return ret
    }
  },
  watch: {
    boardZoom (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setZoom(newVal, this.jsplumbInstance, [0, 0])
      }
    },
    activeModelId (newVal, oldVal) {
      // 初始化变量
      this.endpointPack = {}
      this.jpConnectionsPack = {}
      this.$nextTick(() => {
        // 切换模型时去除缩放动画
        this.clearZoomAnimation($(this.jsplumbInstance.getContainer()))
        // 删除残留连线和端点
        this.resetFlowchart()
        // 回填恢复所有连接
        this.loadConnection()
      })
    },
    nodes (newVal, oldVal) {
      if (!newVal) return
      if (this.prevModelId !== this.activeModelId) {
        this.prevNodes = []
      }
      const newIdArr = newVal.map(item => item.nodeId)
      const oldIdArr = this.prevNodes.map(item => item.nodeId)
      // 筛选出新增的节点和删除的节点
      const addNodes = newVal.filter(item => !oldIdArr.includes(item.nodeId))
      const removeNodes = this.prevNodes.filter(
        item => !newIdArr.includes(item.nodeId)
      )
      // 新增节点，使其可拖拽并添加端点
      if (addNodes && addNodes.length) {
        this.$nextTick(() => {
          this.initNodes(addNodes)
        })
      }
      // 删除节点，删除端点和连线
      if (removeNodes && removeNodes.length) {
        this.deleteEndpointAndConnection(removeNodes)
      }
      // 缓存一份
      this.prevModelId = this.activeModelId
      this.prevNodes = cloneDeep(newVal)
    }
  },
  mounted () {
    jsPlumb.ready(() => {
      // 获取jsPlumb实例，设置默认配置
      this.jsplumbInstance = this.getInstance(this.defaultOption)
      // 绑定连接时事件
      this.jsplumbInstance.bind('connection', this.bindConnection)
      // 解除连接时事件
      this.jsplumbInstance.bind('connectionDetached', this.detachConnection)
      // 不能连自己
      this.jsplumbInstance.bind('beforeDrop', this.selfConnection)
    })
  },
  beforeDestroy () {
    this.jsplumbInstance.unbind() // 解绑所有事件
  },
  methods: {
    ...mapMutations([
      'updateNodesPack',
      'pushConnection',
      'deleteConnection',
      'setEditFlagTrue'
    ]),
    // 保存节点中parents属性
    saveParentsProp (type, parentId, childId) {
      const tNode = this.nodes.find(item => item.nodeId === childId)
      const parents = tNode && tNode.parents.concat()
      if (!tNode) return
      switch (type) {
        case 'add':
          !parents.includes(parentId) && parents.push(parentId)
          break
        case 'delete':
          let idx = parents.indexOf(parentId)
          idx > -1 && parents.splice(idx, 1)
          break
        default:
          break
      }
      // 更新节点信息
      this.updateNodesPack({
        node: {
          nodeId: childId,
          parents: parents
        }
      })
    },
    // 绑定事件
    bindNodeEvt (ev) {
      /**
       * 1.首先要保存节点位置信息
       * 2. 选中当前节点
       */
      const node = $(ev.currentTarget)
      const conDom = $(`#${this.containerId}`)
      const conPos = { x: conDom.offset().left, y: conDom.offset().top }
      const nodePos = node.position()
      const nodeId = node.attr('id')
      const mousePos = { x: ev.clientX - conPos.x, y: ev.clientY - conPos.y }
      let positionX = nodePos.left
      let positionY = nodePos.top
      const detaPos = { x: mousePos.x - positionX, y: mousePos.y - positionY }
      $(document)
        .on('mousemove', ev => {
          positionX = ev.clientX - conPos.x - detaPos.x
          positionY = ev.clientY - conPos.y - detaPos.y
        })
        .on('mouseup', ev => {
          // 更新node信息，涉及的地方都改变
          this.updateNodesPack({
            isSetActive: true,
            node: {
              nodeId,
              positionX: positionX <= 0 ? 0 : positionX / this.boardZoom,
              positionY: positionY <= 0 ? 0 : positionY / this.boardZoom
            }
          })
          this.setEditFlagTrue()
          $(document)
            .off('mousemove')
            .off('mouseup')
        })
    },
    // 连线事件被触发时，前端保存连线信息
    bindConnection (info) {
      // 添加覆盖物：删除符号
      const overlay = this.addOverlay(info.connection)
      // 添加鼠标移入事件
      this.bindMouseEvt(info.connection, overlay)
      // 保存节点的parents属性
      this.saveParentsProp('add', info.sourceId, info.targetId)
      // 保存连接对象，以供删除
      this.saveJpConnections(info.connection)
      // 如果已经有的连接加载中，不再执行保存
      if (this.isConnectionLoading) return
      const sAnchor = [
        info.sourceEndpoint.anchor.x,
        info.sourceEndpoint.anchor.y,
        0, 0, 0, 0
      ]
      const tAnchor = [
        info.targetEndpoint.anchor.x,
        info.targetEndpoint.anchor.y,
        0, 0, 0, 0
      ]
      const connection = {
        connectionId: `conn_${uuid.v1()}`,
        parentNodeId: info.sourceId,
        childNodeId: info.targetId,
        anchors: [sAnchor, tAnchor]
      }
      // 保存连接信息
      this.pushConnection(connection)
      this.setEditFlagTrue()
    },
    // 解除连线事件被触发时，前端删除连线信息
    detachConnection (info) {
      const parentNodeId = info.sourceId
      const childNodeId = info.targetId
      const sAnchor = [
        info.sourceEndpoint.anchor.x,
        info.sourceEndpoint.anchor.y,
        0, 0, 0, 0
      ]
      const tAnchor = [
        info.targetEndpoint.anchor.x,
        info.targetEndpoint.anchor.y,
        0, 0, 0, 0
      ]
      const anchors = [sAnchor, tAnchor]
      let con
      for (let i = 0, len = this.connections.length; i < len; i++) {
        con = this.connections[i]
        if (
          con.parentNodeId === parentNodeId &&
          con.childNodeId === childNodeId &&
          con.anchors[0][0] === anchors[0][0] &&
          con.anchors[0][1] === anchors[0][1] &&
          con.anchors[1][0] === anchors[1][0] &&
          con.anchors[1][1] === anchors[1][1]
        ) {
          this.deleteConnection(i) // 删除存储列表中的连接
          this.jpConnectionsPack[`${con.parentNodeId}_${con.childNodeId}`] = null // 删除储存的连接对象
          this.saveParentsProp('delete', parentNodeId, childNodeId) // 修改节点的parents属性
          break
        }
      }
      this.setEditFlagTrue()
    },
    // 连接前事件,判断是否自己连自己
    selfConnection (conn) {
      if (conn.sourceId === conn.targetId) {
        this.$message({ type: 'error', message: '节点不能连接自己本身!' })
        return false
      } else {
        return true
      }
    },
    // 加载已有连线
    loadConnection () {
      jsPlumb.batch(() => {
        this.connections.forEach(item => {
          this.isConnectionLoading = true // connect执行后会触发connection事件，作为区别的标志
          this.jsplumbInstance.connect({
            source: item.parentNodeId,
            target: item.childNodeId,
            anchors: item.anchors
          })
        })
        this.isConnectionLoading = false
      })
    },
    // 重置流程图
    resetFlowchart () {
      // 删除上个flowchart的连接线和端点，true则不移除绑定事件
      this.jsplumbInstance.reset(true)
    },
    // 初始化相应节点
    initNodes (nodes) {
      this.draggableNodes(nodes.map(item => $(`#${item.nodeId}`)))
      this.addAllEndPoints(nodes)
    },
    // 连接的鼠标事件
    bindMouseEvt (connection, overlay) {
      connection
        .unbind('mouseover', 'mouseout')
        .bind('mouseover', con => {
          overlay.show()
        })
        .bind('mouseout', con => {
          overlay.hide()
        })
    },
    // 连接添加删除图标，并先隐藏
    addOverlay (connection) {
      const instance = this.jsplumbInstance
      let overlay = connection.addOverlay([
        'Custom',
        {
          create (component) {
            return document.createElement('i')
          },
          events: {
            click (labelOverlay, originalEvent) {
              instance.deleteConnection(connection)
            }
          },
          location: 0.5,
          id: `del-btn-${uuid.v1()}`,
          cssClass: 'el-icon-close fc-delete-icon'
        }
      ])
      overlay.hide()
      return overlay
    },
    // 设置数组中节点的endpoint
    addAllEndPoints (nodes) {
      jsPlumb.batch(() => {
        nodes.forEach(item => {
          let code = item.nodeCode
          let id = item.nodeId
          this.endpointPack[id] = [] // 当前节点的端点存放数组初始化
          Object.keys(this.anchorsMap).forEach(key => {
            this.anchorsCodeMap[key].includes(code) &&
              this.anchorsMap[key].forEach(config => {
                let opt = Object.assign({}, this[config.type], {
                  anchor: config.anchor
                })
                let ep = this.addEndPoint(id, opt) // 添加端点
                this.saveEndpoints(ep) // 存放端点
              })
          })
        })
      })
    },
    // 添加endpoint
    addEndPoint (id, opt) {
      return this.jsplumbInstance.addEndpoint(
        id,
        { scope: this.activeModelId },
        opt
      )
    },
    // 保存端点
    saveEndpoints (endpoint) {
      this.endpointPack[endpoint.elementId].push(endpoint)
    },
    saveJpConnections (conn) {
      this.jpConnectionsPack[`${conn.sourceId}_${conn.targetId}`] = conn
    },
    // 删除节点的端点和连线
    deleteEndpointAndConnection (nodes) {
      const connections = cloneDeep(this.connections)
      nodes.forEach(node => {
        connections.forEach((conn, idx) => {
          // 删除相关联的连接
          if (
            conn.childNodeId === node.nodeId ||
            conn.parentNodeId === node.nodeId
          ) {
            let connection = this.jpConnectionsPack[`${conn.parentNodeId}_${conn.childNodeId}`]
            this.jsplumbInstance.deleteConnection(connection) // 会触发connectionDetached事件
          }
          // 删除子节点的parents属性里的nodeId
          if (conn.parentNodeId === node.nodeId) {
            this.saveParentsProp('delete', conn.parentNodeId, conn.childNodeId)
          }
        })
        let endpoints = this.endpointPack[node.nodeId]
        endpoints &&
          endpoints.forEach(ep => {
            this.jsplumbInstance.deleteEndpoint(ep) // 删除节点和关联的连接
          })
        endpoints = [] // 删除保存的端点
      })
    },
    // 获取jsPlumb实例
    getInstance (opt) {
      return jsPlumb.getInstance(opt)
    },
    // 使节点可拖拽
    draggableNodes (nodes) {
      this.jsplumbInstance.draggable(nodes, {
        containment: true
      })
    },
    // 去除缩放动画
    clearZoomAnimation (jqEl) {
      jqEl.css({ transition: 'none', '-webkit-transition': 'none' })
    },
    // 设置缩放
    setZoom (zoom, instance, transformOrigin, el) {
      transformOrigin = transformOrigin || [0.5, 0.5]
      instance = instance || jsPlumb
      el = el || instance.getContainer()
      const jqEl = $(el)
      const prefix = ['webkit', 'moz', 'ms', 'o']
      const scale = `scale(${zoom})`
      const oStr = `${transformOrigin[0] * 100}% ${transformOrigin[1] * 100}%`
      jqEl.css({
        transform: scale,
        'transform-origin': oStr,
        transition: 'transform 0.5s ease, -webkit-transform 0.5s ease',
        '-webkit-transition': '-webkit-transform 0.5s ease'
      })
      for (let i = 0; i < prefix.length; i++) {
        jqEl.css({
          [`-${prefix[i]}-transform`]: scale,
          [`-${prefix[i]}-transform-origin`]: oStr
        })
      }
      instance.setZoom(zoom)
    }
  }
}
</script>
<style lang="stylus" scoped>
.flowchart
  width 2520%
  height 2520%
  position relative
  font-size 14px

  .node
    display flex
    justify-content center
    align-items center
    position absolute
    top 0
    left 0
    border 1px solid #ddd
    border-radius 4px
    background transparent
    padding 6px 16px
    min-width 100px
    box-sizing border-box
    cursor pointer
    user-select none

    .node-text
      padding-left 5px
      padding-top 2px
      white-space nowrap

  .warning-flag
    color #ffaf00
    font-size 18px
    opacity 0.9
    position absolute
    right 4px
    top 50%
    transform translateY(-50%)
</style>
