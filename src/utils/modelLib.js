
import uuid from 'uuid'
import { isArray, isPlainObject } from '@/utils/type'
import { offset, position, css, hasClass, scrollLeft, scrollTop } from '@/utils/dom'
export default {
  data () {
    return {
      eventCache: {
        mouseup: null,
        mousemove: null
      }
    }
  },
  methods: {
    /* 复制并拖动 */
    copyDrag (item, ev) {
      const containerDom = this.$refs.container
      const comptree = this.$refs.comptree
      const curItemDom = this.$refs.dragableItem
      const targetDiv = this.getCurDiv(ev.target)
      const containerOffset = offset(containerDom)
      const targetPosition = position(targetDiv)
      const mouseX = ev.clientX - containerOffset.left
      const mouseY = ev.clientY - containerOffset.top
      const disX = targetPosition.left - scrollLeft(comptree)
      const disY = targetPosition.top - scrollTop(comptree)
      const detaXY = {
        x: mouseX - disX,
        y: mouseY - disY
      } // 鼠标离目标div左侧和上侧的距离
      item.visible = true
      Object.keys(item).forEach(v => {
        this.setTreeNodeProp(this.currentItem, v, item[v])
      })
      // 可移动项目出现在适当位置
      css(curItemDom, {
        left: `${disX}px`,
        top: `${disY}px`,
        width: `calc(100% - ${disX}px)`
      })
      // console.log(item)
      // 拖拽效果
      this.bindDragEvent(curItemDom, item, detaXY)
    },
    /* 实现拖拽效果 */
    bindDragEvent (curItemDom, node, detaXY) {
      const containerDom = this.$refs.container
      this.eventCache = {
        mousemove: (ev) => {
          this.mouseMvFn(ev, {containerDom, curItemDom, detaXY})
        },
        mouseup: (event) => {
          this.mouseUpFn(event, node, detaXY)
        }
      }
      // 事件绑定
      document.addEventListener('mousemove', this.eventCache.mousemove)
      document.addEventListener('mouseup', this.eventCache.mouseup)
    },
    mouseUpFn (event, node, detaXY) {
      this.currentItem.visible = false
      if (!this.boardArea) return
      // 鼠标相对设计板的位置,滚动条滚动的需加上
      const mousePos = {
        x: event.clientX - this.boardArea.left + this.boardArea.scrollLeft,
        y: event.clientY - this.boardArea.top + this.boardArea.scrollTop
      }
      let validPos
      // 拖拽的组件处于设计板，则放入数组，并设置成当前节点
      if (
        mousePos.x > 0 &&
        // mousePos.x <= this.boardArea.w &&
        mousePos.y > 0 &&
        // mousePos.y <= this.boardArea.h &&
        this.judgeDropable(this.currentItem, this.activeModel.type) // 是否可放置
      ) {
        // 需按缩放比例显示
        validPos = {
          x: mousePos.x / this.boardZoom - detaXY.x,
          y: mousePos.y / this.boardZoom - detaXY.y
        }
        // 边界处理：左边和上边不能超出
        if (validPos.x < 0) {
          validPos.x = 0
        }
        if (validPos.y < 0) {
          validPos.y = 0
        }
        this.currentItem.position = {
          x: validPos.x,
          y: validPos.y
        }
        this.updateNode(this.currentItem, this.activeModel.type)
        this.setEditFlagTrue()
      } else if (node.type === 'MODEL') {
        // 若拖得是模型
        this.currentModelChange({...this.currentItem})
      }
      // 解绑事件
      document.removeEventListener('mouseup', this.eventCache.mouseup)
      document.removeEventListener('mousemove', this.eventCache.mousemove)
    },
    mouseMvFn (ev, {containerDom, curItemDom, detaXY}) {
      const containerOffset = offset(containerDom)
      const mouseX = ev.clientX - containerOffset.left // 鼠标离容器左侧距离
      const mouseY = ev.clientY - containerOffset.top // 鼠标离容器上侧距离
      css(curItemDom, {
        left: mouseX - detaXY.x,
        top: mouseY - detaXY.y
      })
    },
    getDataIdx (el) {
      return el.getAttribute('data-idx') || el.parentNode.getAttribute('data-idx')
    },
    /* 生成节点uuid */
    generateUUID () {
      return uuid.v1()
    },
    /* 初始化树 */
    formatTree (tree) {
      // 初始化状态
      this.statusArr.forEach(v => {
        this.setTreeNodeProp(tree, v, false)
      })
    },
    /* 获取当前点击项目div */
    getCurDiv (target) {
      return hasClass(target, 'tree-node-content')
        ? target
        : this.getCurDiv(target.parentNode)
    },
    /* 使某级树节点可拖动 */
    dragable (tree, level) {
      if (isArray(tree)) {
        let item
        for (let i = 0, len = tree.length; i < len; i++) {
          item = tree[i]
          item.dragable = level === 1
          if (level > 1) this.dragable(item.children, level - 1)
          else continue
        }
      }
    },
    /* 设置某个属性值 */
    setTreeNodeProp (target, prop, val) {
      // 判断是单个节点还是多个节点
      if (isPlainObject(target)) {
        // 如果已经存在该属性的值，说明已经设过
        target.hasOwnProperty(prop)
          ? (target[prop] = val)
          : this.$set(target, prop, val)
      } else if (isArray(target)) {
        target.forEach(item => {
          this.setTreeNodeProp(item, prop, val)
          item.children && this.setTreeNodeProp(item.children, prop, val)
        })
      }
    }
  }
}
