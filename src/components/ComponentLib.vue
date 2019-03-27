<template>
  <div class="comp-tree-container" ref="container">
    <div class="comp-tree-filter">
      <h4 class="title fs20">建模组件</h4>
      <el-input class="filter-input" placeholder="请输入关键字" v-model="model" clearable></el-input>
    </div>
    <div class="comp-tree" @mousedown.stop.prevent="bindEvent">
      <unit-tree :tree="computedTree" focusable/>
      <div class="tree-empty" v-if="isEmpty || errMsg">{{ errMsg || '暂无数据' }}</div>
    </div>
    <!-- 可变拖动块 -->
    <div
      class="tree-node-content dragable-item"
      :class="{'dragable-item-origin-pos': !isVisible}"
      v-show="isVisible"
      ref="dragableItem"
    >
      <glyph-icon
        :name="currentItem.icon && currentItem.icon.class"
        :color="currentItem.icon && currentItem.icon.color"
      />
      <span :title="currentItem.label" class="tree-node-text">{{currentItem.label}}</span>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import uuid from 'uuid'
import UnitTree from '@/components/UnitTree'

import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ComponentLib',
  components: {
    UnitTree
  },
  data () {
    return {
      statusArr: ['hide', 'dragable'],
      model: '',
      errMsg: '', // 信息反馈
      currentItem: {
        visible: false
      }, // 当前拖动项
      isViewCodes: ['ZJ-103'], // 数据可视化（输出）
      isMLCodes: ['ZJ-105', 'ZJ-106'] // 是否机器学习
    }
  },
  computed: {
    ...mapState(['boardArea', 'components', 'activeModel']),
    ...mapGetters(['activeNode', 'boardZoom', 'nodes']),
    // 是否输出
    isOutCodes () {
      return this.isViewCodes.concat(this.isMLCodes)
    },
    isEmpty () {
      return !this.computedTree || !this.computedTree.length
    },
    isVisible () {
      return this.currentItem && this.currentItem.visible
    },
    computedTree () {
      return this.filterTree(this.components, this.model)
    }
  },
  created () {
    // 初始化菜单状态
    this.statusArr.forEach(v => {
      this.setTreeNodeProp(this.components, v, false)
    })
    // 使二级菜单可拖拽
    this.dragable(this.components, 2)
  },
  mounted () {},
  methods: {
    ...mapMutations(['genNodeOfCode', 'setEditFlagTrue']),
    bindEvent ($event) {
      // 事件委托在最外层
      const target = $($event.target)
      const tmpIdx = target.data('idx')
      const idx = tmpIdx != null ? tmpIdx : target.parent().data('idx')
      if (idx == null) return
      const idxArr = String(idx).split('_')
      const item = this.getCurItem(this.components, idxArr)
      // 切换展开状态
      $.isArray(item.children) && (item.expanded = !item.expanded)
      // 初始化所有节点状态
      this.setTreeNodeProp(this.components, 'current', false)
      // 改变当前行状态
      item.current = true
      // 判断是否可拖拽
      if (item.dragable) {
        // 模拟拖拽效果
        this.copyDrag(item, $event)
      }
    },
    /* 复制并拖动 */
    copyDrag (item, ev) {
      const containerDom = $(this.$refs.container)
      const curItemDom = $(this.$refs.dragableItem)
      const targetDiv = this.getCurDiv($(ev.target))
      const mouseX = ev.clientX - containerDom.offset().left // 鼠标离容器左侧距离
      const mouseY = ev.clientY - containerDom.offset().top // 鼠标离容器上侧距离
      const disX = targetDiv.position().left // 目标div离容器左侧距离
      const disY = targetDiv.position().top // 目标div离容器上侧距离
      const detaXY = {
        X: mouseX - disX,
        Y: mouseY - disY
      } // 鼠标离目标div左侧和上侧的距离
      // 可移动项目出现在适当位置
      item.visible = true
      Object.keys(item).forEach(v => {
        this.setTreeNodeProp(this.currentItem, v, item[v])
      })
      curItemDom
        .css({
          left: `${disX}px`,
          top: `${disY}px`,
          width: `calc(100% - ${disX}px)`,
          opacity: 0
        })
        .animate({ opacity: 1 }, 500)
      // 拖拽效果
      this.bindDragEvent(curItemDom, detaXY)
    },
    /* 实现拖拽效果 */
    bindDragEvent (curItemDom, detaXY) {
      const containerDom = $(this.$refs.container)
      const item = this.currentItem
      const boardArea = this.boardArea
      const boardZoom = this.boardZoom
      const activeModelType = this.activeModel.type
      const dropable = this.judgeDropable
      const updateNode = this.updateNode
      $(document)
        .on('mousemove', ev => {
          const mouseX = ev.clientX - containerDom.offset().left // 鼠标离容器左侧距离
          const mouseY = ev.clientY - containerDom.offset().top // 鼠标离容器上侧距离
          curItemDom.css({
            left: mouseX - detaXY.X,
            top: mouseY - detaXY.Y
          })
        })
        .on('mouseup', event => {
          item.visible = false
          if (!boardArea) return
          // 鼠标相对设计板的位置
          const mousePos = {
            x: event.clientX - boardArea.left,
            y: event.clientY - boardArea.top
          }
          // 拖拽的组件处于设计板，则放入数组，并设置成当前节点
          if (
            mousePos.x > 0 &&
            mousePos.x <= boardArea.w &&
            mousePos.y > 0 &&
            mousePos.y <= boardArea.h &&
            dropable(activeModelType, item)
          ) {
            // 滚动条滚动的需加上，需按缩放比例显示
            item.position = {
              x: (mousePos.x + boardArea.scrollLeft) / boardZoom,
              y: (mousePos.y + boardArea.scrollTop) / boardZoom
            }
            updateNode(item)
            this.setEditFlagTrue()
          }
          // 解绑事件
          $(document)
            .off('mouseup')
            .off('mousemove')
        })
    },
    updateNode (item) {
      // 根据code生成不同节点信息，更新当前节点信息
      this.genNodeOfCode({
        nodeId: this.generateUUID(),
        nodeCode: item.code,
        nodeName: item.label,
        positionX: item.position.x,
        positionY: item.position.y,
        isOut: this.judgeIsOut(item)
      })
    },
    /* 生成节点uuid */
    generateUUID () {
      return uuid.v1()
    },
    /* 是否可放置 */
    judgeDropable (modelType, item) {
      let flag = false
      if (modelType === 'MODEL') {
        flag = !this.judgeIsML(item)
        !flag &&
          this.$notify({
            title: '温馨提醒',
            message: '普通模型不支持使用机器学习类组件哦 ^_^',
            type: 'warning'
          })
      } else if (modelType === 'SPARK') {
        // 分别筛选出机器学习节点，普通非输出节点，模型节点
        const mlNodes = []
        const modelNodes = []
        this.nodes.forEach(node => {
          if (node.nodeCode.includes('MODEL')) {
            modelNodes.push(node)
          } else if (
            node.nodeCode.includes('ZJ-105') ||
            node.nodeCode.includes('ZJ-106')
          ) {
            mlNodes.push(node)
          }
        })
        const isMlItem = this.judgeIsML(item)
        if (this.judgeIsView(item)) {
          this.$notify({
            title: '温馨提醒',
            message: '机器学习模型不支持使用数据可视化类组件哦 ^_^',
            type: 'warning'
          })
        } else if (modelNodes.length !== 0 && !isMlItem) {
          this.$notify({
            title: '温馨提醒',
            message: '机器学习模型中已存在普通模型，不支持再拖入组件哦 ^_^',
            type: 'warning'
          })
        } else if (mlNodes.length !== 0 && isMlItem) {
          this.$notify({
            title: '温馨提醒',
            message: '机器学习模型中只允许拖入一个机器学习组件哦 ^_^',
            type: 'warning'
          })
        } else {
          return true
        }
      } else {
        this.$notify({
          title: '温馨提醒',
          message: '战法仅支持使用普通模型哦 ^_^',
          type: 'warning'
        })
      }
      return flag
    },
    /* 是否机器学习 */
    judgeIsML (item) {
      return this.judgeFn(this.isMLCodes, item)
    },
    /* 是否输出 */
    judgeIsOut (item) {
      return this.judgeFn(this.isOutCodes, item)
    },
    /* 是否可视化 */
    judgeIsView (item) {
      return this.judgeFn(this.isViewCodes, item)
    },
    judgeFn (codeArr, item) {
      return !!codeArr.filter(code => item.code.includes(code)).length
    },
    /* 获取当前点击项目div */
    getCurDiv (target) {
      return target.hasClass('tree-node-content')
        ? target
        : this.getCurDiv(target.parent())
    },
    /* 使某级树节点可拖动 */
    dragable (tree, level) {
      if ($.isArray(tree)) {
        let item
        for (let i = 0, len = tree.length; i < len; i++) {
          item = tree[i]
          item.dragable = level === 1
          if (level > 1) this.dragable(item.children, level - 1)
          else continue
        }
      }
    },
    /* 筛选 */
    filterTree (tree, model) {
      let nodata = true
      tree.forEach(item => {
        // item.expanded = true
        item.hide = true
        if ($.isArray(item.children)) {
          item.children.forEach(v => {
            v.hide = !v.label.includes(model)
            // 若子有不为hide, 则父不为hide
            !v.hide && (item.hide = false)
          })
        }
        // 若父有不为hide，则有数据
        !item.hide && (nodata = false)
      })
      this.errMsg = nodata ? '没有符合条件的数据' : ''
      return tree
    },
    /* 设置某个属性值 */
    setTreeNodeProp (target, prop, val) {
      // 判断是单个节点还是多个节点
      if ($.isPlainObject(target)) {
        // 如果已经存在该属性的值，说明已经设过
        target.hasOwnProperty(prop)
          ? (target[prop] = val)
          : this.$set(target, prop, val)
      } else if ($.isArray(target)) {
        target.forEach(item => {
          this.setTreeNodeProp(item, prop, val)
          $.isArray(item.children) &&
            this.setTreeNodeProp(item.children, prop, val)
        })
      }
    },
    /* 获取当前点击的项 */
    getCurItem (tree, idxArr) {
      let res
      let tmp = tree
      idxArr.forEach(idx => {
        res = tmp[idx]
        if (res.children) {
          tmp = res.children
        }
      })
      return res
    }
  }
}
</script>
