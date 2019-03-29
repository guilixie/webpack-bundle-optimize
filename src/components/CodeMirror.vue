<template>
  <div class="code-mirror-wrapper">
    <codemirror v-model="code" :options="options" :placeholder="placeholder"></codemirror>
    <slot :code="code"></slot>
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/display/placeholder.js'

export default {
  name: 'CodeMirror',
  components: {
    codemirror
  },
  props: ['value', 'options', 'placeholder'],
  computed: {
    code: {
      get () { return this.value },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.code-mirror-wrapper{
  position: relative;
  height: 100%;
  /deep/
  .vue-codemirror{
    height: 100%;
    .CodeMirror-wrap{
      height: 100%;
    }
  }
  /deep/
  .CodeMirror-placeholder{
    color: #999;
  }
}
</style>
