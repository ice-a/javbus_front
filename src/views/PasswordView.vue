<template>
  <div class="password-container">
    <a-layout class="layout">
      <a-layout-content class="content">
        <div class="password-card">
          <a-card title="访问验证" bordered>
            <div class="card-content">
              <p class="description">请输入密码以访问网站</p>
              
              <a-form layout="vertical" @submit="handleLogin">
                <a-form-item label="密码">
                  <a-input-password
                    v-model:value="password"
                    placeholder="请输入访问密码"
                    size="large"
                    @pressEnter="handleLogin"
                    :disabled="loading"
                  />
                </a-form-item>
                
                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    :loading="loading"
                    :disabled="!password || loading"
                    block
                    @click="handleLogin"
                  >
                    {{ loading ? '验证中...' : '访问网站' }}
                  </a-button>
                </a-form-item>
              </a-form>

              <a-alert
                v-if="error"
                :message="error"
                type="error"
                show-icon
                class="error-alert"
              />
            </div>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!password.value.trim()) {
    error.value = '请输入密码';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // 获取环境变量中的密码
    const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD || 'admin123';
    
    // 模拟异步验证
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password.value === correctPassword) {
      // 设置认证状态
      localStorage.setItem('authenticated', 'true');
      message.success('密码正确，正在跳转...');
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        router.push('/home');
      }, 800);
    } else {
      error.value = '密码错误，请重试';
      message.error('密码错误');
      password.value = ''; // 清空密码输入框
    }
  } catch {
    error.value = '验证失败，请稍后重试';
    message.error('验证失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.layout {
  background: transparent;
  width: 100%;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
}

.password-card {
  width: 100%;
  max-width: 420px;
  animation: fadeIn 0.5s ease-in-out;
}

.password-card :deep(.ant-card) {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: none;
}

.password-card :deep(.ant-card-head) {
  background: transparent;
  border-bottom: none;
  padding: 24px 24px 12px;
}

.password-card :deep(.ant-card-head-title) {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  text-align: center;
}

.card-content {
  padding: 12px 24px 24px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.password-card :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #333;
}

.password-card :deep(.ant-input),
.password-card :deep(.ant-input-password) {
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.password-card :deep(.ant-input:focus),
.password-card :deep(.ant-input-password:focus) {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.password-card :deep(.ant-btn-primary) {
  border-radius: 6px;
  font-weight: 500;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  height: 44px;
  font-size: 16px;
}

.password-card :deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
}

.password-card :deep(.ant-btn-primary[disabled]) {
  background: #d9d9d9;
  border-color: #d9d9d9;
}

.error-alert {
  margin-top: 16px;
  border-radius: 6px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .password-container {
    padding: 16px;
  }
  
  .password-card {
    max-width: 100%;
  }
  
  .password-card :deep(.ant-card-head-title) {
    font-size: 20px;
  }
  
  .card-content {
    padding: 8px 16px 16px;
  }
}
</style>