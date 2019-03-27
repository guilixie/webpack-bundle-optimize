<template>
  <ul class="footer-menu">
    <li class="menu-item" v-for="item in menuItems" :key="item.name">
      <a :href="item.href" target="_blank" :class="{'active': item.href===pathname}">
        <svg-icon :icon-class="item.icon" class-name="menu-icon" :title="item.label"/>
        <span class="menu-label">{{item.label}} </span>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FooterMenu',
  data () {
    return {
      pathname: window.location.pathname,
      menuItems: [{
        href: '/datashow.html',
        name: 'datashow',
        label: '数据列表',
        icon: 'table'
      }, {
        href: '/flowshow.html',
        name: 'flowshow',
        label: '模型创建',
        icon: 'scatter'
      }, {
        href: '/chartshow.html',
        name: 'chartshow',
        label: '图表展示',
        icon: 'bar'
      }, {
        href: '/codeshow.html',
        name: 'codeshow',
        label: '代码编辑',
        icon: 'treemap'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.footer-menu {
  position: absolute;
  bottom: 0;
  width: 100%;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;

  .menu-item {
    width: 25%;

    &>a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      color: #999;
      font-size: 12px;
      text-decoration: none;
      cursor: pointer;
      &:hover,
      &:active,
      &.active {
        background-color: #f5f5f5;
        color: #409eff;
      }
    }
  }

  .menu-icon {
    color: #303030;
    width: 30px;
    height: 30px;
  }

  .menu-label{
    padding-top: 5px;
    font-weight: bold;
  }
}
</style>
