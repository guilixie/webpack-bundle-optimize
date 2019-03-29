<template>
  <div id="app">
    <div style="padding:0 15px;height:100%;">
      <code-mirror class="codemirror-wrap input-codemirror" v-model="inputStr" :options="cmOptions">
        <template slot-scope="{ code }">
          <svg-icon icon-class="clear" class-name="action-icon" title="清空" style="right: 10px;" @click.native="clear()" />
          <svg-icon icon-class="copy" class-name="action-icon" title="复制" style="right: 40px;" @click.native="copy(code)" />
          <svg-icon icon-class="compress" class-name="action-icon" title="压缩" style="right: 70px;" @click.native="compress(code)" />
          <svg-icon icon-class="format" class-name="action-icon" title="格式化" style="right: 100px;" @click.native="format(code)" />
        </template>
      </code-mirror>
    </div>
    <footer-menu></footer-menu>
  </div>
</template>

<script>
// 主题
import 'codemirror/theme/idea.css'
// 代码高亮
import 'codemirror/mode/javascript/javascript.js'
// 括号匹配
import 'codemirror/addon/edit/matchbrackets.js'
// 支持代码折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
// 行注释
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/comment/continuecomment.js'

import CodeMirror from '@/components/CodeMirror'
import FooterMenu from '@/components/FooterMenu'
import {isJSON} from '@/utils/type'

export default {
  name: 'App',
  components: {
    FooterMenu,
    CodeMirror
  },
  data () {
    return {
      inputStr: '[{"job":"银行业务员","id":"bCEBDee6-e8aa-A39A-82FC-F7b9fc3f9d8a","name":"罗明","age":84374155021903,"address":"江苏省 盐城市","jobage":4818286932310109,"birthday":"2015-11-06"},{"job":"银行业务员","id":"61Af291d-DE87-5Cc1-CbFf-A4FE8C9ddc5b","name":"邹超","age":822307453209701,"address":"江苏省 泰州市","jobage":1876774658182499,"birthday":"2002-07-10"},{"job":"医生","id":"eDDFBE4F-BCDE-dDeA-dDEf-1ceBbB86A4A1","name":"秦平","age":5066484808180482,"address":"江苏省 镇江市","jobage":910560507877754,"birthday":"2005-05-22"},{"job":"银行业务员","id":"B6AAe3d2-C7bE-02Ad-AC9A-fe6c8Adb8CF9","name":"贺桂英","age":8456144181570642,"address":"河北省 邢台市","jobage":1623173709496798,"birthday":"1982-03-29"},{"job":"银行业务员","id":"fCC1bbaf-63Bc-EBC0-246A-72E35Adce4Fb","name":"戴秀兰","age":4248775074030687,"address":"海南省 三亚市","jobage":4624630144790053,"birthday":"2000-09-24"},{"job":"IT研发","id":"ABDDD912-CfC1-5E8f-c94F-1Bd64d40C5eB","name":"万伟","age":6642417527396288,"address":"黑龙江省 七台河市","jobage":8241626153238596,"birthday":"1997-04-02"},{"job":"银行业务员","id":"7deFEBc6-CfC6-E770-CfBe-669E50488956","name":"任敏","age":1452758284766378,"address":"福建省 泉州市","jobage":7653331119108419,"birthday":"1996-07-31"},{"job":"护士","id":"c5A171D0-b23F-b214-9ebA-DCEc41e3a8f5","name":"丁军","age":4644168120225114,"address":"重庆 重庆市","jobage":2003603706438958,"birthday":"1971-01-15"},{"job":"护士","id":"1ddFCd92-F459-eCdf-CB1A-CAFa13b7bfE2","name":"谢伟","age":3434683577401764,"address":"重庆 重庆市","jobage":1996531836850822,"birthday":"1982-05-04"},{"job":"汽车销售","id":"CF597c3c-8c7E-28CD-4c28-Bc42f5F6dcF1","name":"常磊","age":7186107738461288,"address":"山西省 晋中市","jobage":4137426783929242,"birthday":"2000-03-29"}]',
      cmOptions: {
        mode: 'application/json',
        lineNumbers: true,
        line: true,
        // readOnly: 'nocursor',
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true, // 显示行号
        theme: 'idea', // 设置主题
        lineWrapping: true, // 代码折叠
        autofocus: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        matchBrackets: true, // 括号匹配
        autoCloseBrackets: true
      }
    }
  },
  methods: {
    formatJson (json, indent = 2) {
      return JSON.stringify(json, null, indent)
    },
    copy (code) {
      this.$copyText(code).then(e => {
        // console.log(e)
        // this.$message({ type: 'success', message: '复制成功' })
        alert('复制成功')
      }, e => {
        console.log(e)
      })
    },
    // 格式化
    format (code) {
      if (!code || !isJSON(code)) return
      const json = JSON.parse(code)
      this.inputStr = this.formatJson(json)
    },
    // 压缩
    compress (code) {
      this.inputStr = code.replace(/\s+/g, '')
    },
    // 清空
    clear () {
      this.inputStr = ''
    }
  }
}
</script>

<style lang="less" scoped>
.codemirror-wrap{
  .action-icon{
    opacity: 0.4;
    &:hover,&:focus{
      opacity: 0.8;
    }
  }
  /deep/
  .vue-codemirror{
    padding-right: 115px;
  }
}
</style>
