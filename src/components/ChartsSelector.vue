<template>
  <div class="charts-selector" :style="computedStyle" @mouseleave="changeVisible(false)">
    <div class="expand-button" @click="clickExpandButton">
      <i class="expand-icon" :class="`el-icon-d-arrow-${visible ? 'right' : 'left'}`"></i>
    </div>
    <ul class="type-list">
      <li
        class="type-item"
        :class="item.name === current && 'active-item'"
        :title="item.label"
        :key="item.name"
        v-for="item in charts"
        v-show="item.show"
        :disabled="item.disabled"
        @click="!item.disabled && select(item.name)"
      >
        <svg-icon :icon-class="item.icon" class-name="type-icon" :title="item.label"/>
      </li>
    </ul>
  </div>
</template>
<script>
/* current: '', // 当前选择
  visible: false, // 是否出现
  styleObj: {} // 位置样式 */
export default {
  name: 'ChartsSelector',
  props: ['charts', 'current', 'visible', 'styleObj'],
  computed: {
    computedStyle () {
      return {
        ...this.styleObj,
        right: this.visible ? 0 : this.styleObj.right || `-${this.styleObj.width || '120px'}`
      }
    }
  },
  methods: {
    select (type) {
      this.$emit('change-state', {
        current: type
      })
    },
    clickExpandButton () {
      // 当前没值，说明不可用
      if (!this.current) {
        this.$message.warning('仅用于切换图形的类型')
        return
      }
      this.changeVisible()
    },
    changeVisible (isVisible) {
      this.$emit('change-state', {
        visible: isVisible !== undefined ? isVisible : !this.visible
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.charts-selector
  width 120px
  background-color #ffffff
  box-sizing border-box
  border-radius 4px
  border 1px solid #ddd
  position absolute
  right 0
  top 60px
  transition right 0.4s ease

  .expand-button
    box-sizing border-box
    background-color #409EFF
    padding 20px 7px
    position absolute
    top 30px
    left -31px
    border-top-left-radius 4px
    border-bottom-left-radius 4px
    cursor pointer

    &:hover
      background-color #66b1ff

  .expand-icon
    font-size 16px
    color #fff

  .type-list
    box-sizing border-box

  .type-item
    box-sizing border-box
    width 50%
    height 60px
    display inline-flex
    justify-content center
    align-items center
    cursor pointer
    border 1px solid #ddd
    border-left-width 0
    border-top-width 0

    &:hover
      background-color #F56C6C

    &.active-item
      background-color #F56C6C

    &[disabled]
      opacity 0.25
      background-color #fff
      cursor not-allowed

  .type-icon
    width 32px !important
    height 32px !important
</style>
