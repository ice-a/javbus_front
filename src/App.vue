<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
:root {
  color: #1f1b16;
  background: #f5f0e4;
  font-family:
    Georgia,
    'Times New Roman',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    serif;
  line-height: 1.5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

body {
  min-height: 100vh;
  background: #f5f0e4;
}

button,
input,
select,
textarea {
  font: inherit;
}

.ant-btn {
  border-radius: 10px;
  box-shadow: none;
}

.ant-input,
.ant-input-affix-wrapper,
.ant-select-selector {
  border-radius: 10px !important;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(76, 57, 39, 0.08);
}

::-webkit-scrollbar-thumb {
  background: rgba(124, 47, 26, 0.32);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 47, 26, 0.46);
}
</style>
