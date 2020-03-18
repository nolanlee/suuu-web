<template>
  <el-container>
    <el-header>
      <a href="/" class="navbar-brand">
        <span class="app-title">Suuu</span><span class="app-version">alpha</span>
      </a>
    </el-header>
    <el-container>
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Suuu',
  };
</script>

<style>
  html,body {
    margin: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background-color: #F2F6FC;
  }
  .el-header {
    background-color: #3f51b5;
    color: #fff;;
    line-height: 60px;
  }
  .navbar-brand {
    position: relative;
    height: 60px;
    color: inherit;
    font-size: 18px;
    text-decoration: none;
  }
  .app-title {
    font-size: 2em;
  }
  .app-version {
    font-size: 0.5em;
    margin-left: 0.5em;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
</style>
