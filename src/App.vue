<template>
  <div id="app">
    <header>
      <h1 @click="goHome" style="cursor: pointer;">JAVBUS 搜索工具</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* 输入框样式 */
.input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: #42b983;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* 错误提示 */
.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

/* 成功提示 */
.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

/* 链接样式 */
.link {
  color: #42b983;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

/* 表格样式 */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table tr:hover {
  background-color: #f8f9fa;
}
</style>