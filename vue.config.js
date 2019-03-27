'use strict'

module.exports = {
  pages: {
    codeshow: {
      entry: './src/views/codeshow/main.js',
      template: './public/codeshow.html',
      filename: 'codeshow.html',
      favicon: './public/favicon.ico',
      title: '代码编辑器',
      chunks: ['manifest', 'vendor', 'codeshow']
    },
    datashow: {
      entry: './src/views/datashow/main.js',
      template: './public/datashow.html',
      filename: 'datashow.html',
      favicon: './public/favicon.ico',
      title: '数据列表',
      chunks: ['manifest', 'vendor', 'datashow']
    },
    flowshow: {
      entry: './src/views/flowshow/main.js',
      template: './public/flowshow.html',
      filename: 'flowshow.html',
      favicon: './public/favicon.ico',
      title: '模型创建',
      chunks: ['manifest', 'vendor', 'flowshow']
    },
    chartshow: {
      entry: './src/views/chartshow/main.js',
      template: './public/chartshow.html',
      filename: 'chartshow.html',
      favicon: './public/favicon.ico',
      title: '图表展示',
      chunks: ['manifest', 'vendor', 'chartshow']
    }
  }
}
