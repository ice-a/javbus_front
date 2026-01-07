<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 主应用组件 - 使用 Ant Design Vue 的路由视图
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: #f0f2f5;
}

#app {
  min-height: 100vh;
}

/* 确保 Ant Design Vue 组件样式正常显示 */
.ant-layout {
  min-height: 100vh;
}

.ant-btn {
  border-radius: 6px;
}

.ant-input,
.ant-input-password {
  border-radius: 6px;
}

.ant-card {
  border-radius: 8px;
}

.ant-descriptions-bordered .ant-descriptions-item-label,
.ant-descriptions-bordered .ant-descriptions-item-content {
  border: 1px solid #f0f0f0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
