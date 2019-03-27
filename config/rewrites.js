// 使用vue-router 的history模式时，开发环境时需要配置，生产环境需要后端支持
module.exports = [{
  from: /^\/index/, // 使用正则匹配命中路由
  to: '/index.html'
},
{
  from: /^\/datacollect/,
  to: '/datacollect.html'
},
{
  from: /^\/workspace/,
  to: '/workspace.html'
},
{
  from: /^\/publish/,
  to: '/publish.html'
},
{
  from: /^\/ml/,
  to: '/ml.html'
},
{
  from: /.*/,
  to: '/index.html'
}
]
