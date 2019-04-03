<template>
  <div class="comp-tree-container" ref="container">
    <div class="comp-tree-filter">
      <h4 class="title fs20">建模组件</h4>
      <el-input class="filter-input" placeholder="请输入关键字" v-model="model" clearable></el-input>
    </div>
    <div class="comp-tree" ref="comptree" @mousedown.stop.prevent="bindEvent">
      <unit-tree :tree="computedTree" focusable/>
      <div class="tree-empty" v-if="isEmpty || errMsg">{{ errMsg || '暂无数据' }}</div>
    </div>
    <!-- 可变拖动块 -->
    <transition name="fade">
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
    </transition>
  </div>
</template>
<script>
import { isArray } from '@/utils/type'
import modelTreeMixin from '@/utils/modelLib'
import UnitTree from '@/components/UnitTree'
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('vmp')

export default {
  name: 'ComponentLib',
  components: {
    UnitTree
  },
  mixins: [modelTreeMixin],
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
    this.formatTree(this.components)
    // 使二级菜单可拖拽
    this.dragable(this.components, 2)
  },
  methods: {
    ...mapMutations(['genNodeOfCode', 'setEditFlagTrue']),
    bindEvent (event) {
      // 事件委托在最外层
      const target = event.target
      const idx = this.getDataIdx(target)
      if (idx == null) return
      const idxArr = String(idx).split('_')
      const item = this.getCurItem(this.components, idxArr)
      // 切换展开状态
      isArray(item.children) && (item.expanded = !item.expanded)
      // 初始化所有节点状态
      this.setTreeNodeProp(this.components, 'current', false)
      // 改变当前行状态
      item.current = true
      // 判断是否可拖拽
      if (item.dragable) {
        // 模拟拖拽效果
        this.copyDrag(item, event)
      }
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
    /* 是否可放置 */
    judgeDropable (item, modelType) {
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
    /* 筛选 */
    filterTree (tree, model) {
      let nodata = true
      tree.forEach(item => {
        // item.expanded = true
        item.hide = true
        if (isArray(item.children)) {
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
