<template>
  <div class="home-container">
    <a-layout class="layout">
      <a-layout-header class="header">
        <h1 class="title">JAVBUS 搜索工具</h1>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="main-wrapper">
          <!-- 搜索区域 -->
          <div class="search-section">
            <a-card title="搜索视频" class="search-card">
              <a-form layout="vertical">
                <a-form-item label="视频编号">
                  <a-input
                    v-model:value="keyword"
                    placeholder="输入视频编号，例如：PPBD-145"
                    size="large"
                    @pressEnter="search"
                    :disabled="loading"
                  />
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button
                      type="primary"
                      size="large"
                      @click="search"
                      :loading="loading"
                      :disabled="!keyword || loading"
                    >
                      {{ loading ? '搜索中...' : '搜索' }}
                    </a-button>
                    <a-button
                      size="large"
                      @click="clearResults"
                      v-if="movieData || magnets.length > 0"
                    >
                      清空结果
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-card>
          </div>

          <!-- 错误提示 -->
          <a-alert
            v-if="error"
            :message="error"
            type="error"
            show-icon
            class="error-alert"
          />

          <!-- 搜索结果 -->
          <div v-if="movieData" class="results-section">
            <!-- 电影信息 -->
            <a-card title="视频信息" class="result-card">
              <div class="movie-content">
                <div class="movie-cover" v-if="movieData.img">
                  <a-image :src="movieData.img" :alt="movieData.title" />
                </div>
                <div class="movie-details">
                  <h3>{{ movieData.title }}</h3>
                  <a-descriptions :column="2" size="small" bordered>
                    <a-descriptions-item label="编号">
                      {{ movieData.id }}
                    </a-descriptions-item>
                    <a-descriptions-item label="日期">
                      {{ movieData.date }}
                    </a-descriptions-item>
                    <a-descriptions-item label="时长">
                      {{ formatDuration(movieData.videoLength) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="导演" v-if="movieData.director">
                      {{ movieData.director.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="制作商" v-if="movieData.producer">
                      {{ movieData.producer.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="发行商" v-if="movieData.publisher">
                      {{ movieData.publisher.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="系列" v-if="movieData.series">
                      {{ movieData.series.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="类别" :span="2">
                      {{ getGenresText(movieData.genres) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="演员" :span="2">
                      {{ getStarsText(movieData.stars) }}
                    </a-descriptions-item>
                  </a-descriptions>
                  <div class="action-buttons">
                    <a-button
                      type="primary"
                      size="large"
                      @click="loadMagnets"
                      :loading="magnetsLoading"
                    >
                      {{ magnetsLoading ? '加载中...' : '下载磁力链接' }}
                    </a-button>
                  </div>
                </div>
              </div>
            </a-card>

            <!-- 相似视频 -->
            <a-card
              v-if="movieData.similarMovies && movieData.similarMovies.length > 0"
              title="相似视频"
              class="result-card"
            >
              <div class="similar-grid">
                <a-card
                  v-for="similar in movieData.similarMovies"
                  :key="similar.id"
                  class="similar-item"
                  @click="searchSimilar(similar.id)"
                  hoverable
                >
                  <div class="similar-cover">
                    <a-image :src="similar.img" :alt="similar.title" />
                  </div>
                  <div class="similar-title">{{ similar.title }}</div>
                </a-card>
              </div>
            </a-card>

            <!-- 磁力链接列表 -->
            <a-card
              v-if="magnets.length > 0"
              :title="`磁力链接 (${magnets.length})`"
              class="result-card"
            >
              <div class="magnet-filters">
                <a-checkbox v-model:checked="showOnlyHD">只显示高清</a-checkbox>
                <a-checkbox v-model:checked="showOnlySubtitle">只显示有字幕</a-checkbox>
                <a-select
                  v-model:value="sortBy"
                  style="width: 120px"
                  @change="handleSortChange"
                >
                  <a-select-option value="size">按大小排序</a-select-option>
                  <a-select-option value="date">按时间排序</a-select-option>
                  <a-select-option value="shareDate">按分享时间排序</a-select-option>
                </a-select>
              </div>
              <a-list item-layout="vertical" :data-source="filteredMagnets">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="renderMagnetTitle(item)"
                      :description="`大小：${item.size} | 分享时间：${item.shareDate}`"
                    />
                    <template #actions>
                      <a-button size="small" @click="copyMagnet(item)">复制链接</a-button>
                      <a-button type="primary" size="small" @click="downloadMagnet(item)">下载</a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';

const keyword = ref('');
const loading = ref(false);
const magnetsLoading = ref(false);
const error = ref('');
const movieData = ref(null);
const magnets = ref([]);
const showOnlyHD = ref(false);
const showOnlySubtitle = ref(false);
const sortBy = ref('size');

// 搜索电影
const search = async () => {
  if (!keyword.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  movieData.value = null;
  magnets.value = [];
  
  try {
    // 直接调用第三方 API，而不是通过代理
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://av-api.020417.xyz';
    const response = await fetch(`${apiUrl}/api/movies/${keyword.value.trim()}`);

    if (!response.ok) {
      throw new Error('搜索失败，请检查编号是否正确');
    }
    const data = await response.json();
    console.log('搜索结果:', data);
    movieData.value = data;
    message.success('搜索成功！');
  } catch (err) {
    error.value = err.message || '搜索出错，请稍后重试';
    message.error(err.message || '搜索出错，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 加载磁力链接
const loadMagnets = async () => {
  if (!movieData.value) return;
  
  magnetsLoading.value = true;
  error.value = '';
  
  try {
    const { gid, uc } = movieData.value;
    // 直接调用第三方 API，而不是通过代理
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://av-api.020417.xyz';
    const response = await fetch(`${apiUrl}/api/magnets/${movieData.value.id}?gid=${gid}&uc=${uc}&sortBy=${sortBy.value}&sortOrder=asc`);
    
    if (!response.ok) {
      throw new Error('加载磁力链接失败');
    }
    const data = await response.json();
    magnets.value = data;
    message.success(`成功加载 ${data.length} 个磁力链接`);
  } catch (err) {
    error.value = err.message || '加载磁力链接出错';
    message.error(err.message || '加载磁力链接出错');
  } finally {
    magnetsLoading.value = false;
  }
};

// 搜索相似视频
const searchSimilar = (id) => {
  keyword.value = id;
  search();
};

// 清空结果
const clearResults = () => {
  keyword.value = '';
  movieData.value = null;
  magnets.value = [];
  error.value = '';
};

// 处理排序变化
const handleSortChange = () => {
  if (magnets.value.length > 0 && movieData.value) {
    // 重新加载磁力链接以应用新的排序
    loadMagnets();
  }
};

// 过滤磁力链接
const filteredMagnets = computed(() => {
  let result = [...magnets.value];
  
  if (showOnlyHD.value) {
    result = result.filter(m => m.isHD);
  }
  
  if (showOnlySubtitle.value) {
    result = result.filter(m => m.hasSubtitle);
  }
  
  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'size') {
      return b.numberSize - a.numberSize;
    } else if (sortBy.value === 'date') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    } else if (sortBy.value === 'shareDate') {
      return new Date(b.shareDate) - new Date(a.shareDate);
    }
    return 0;
  });
  
  return result;
});

// 格式化时长
const formatDuration = (minutes) => {
  if (!minutes) return '未知';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
};

// 获取类别文本
const getGenresText = (genres) => {
  if (!genres || genres.length === 0) return '未知';
  return genres.map(g => g.name).join('、');
};

// 获取演员文本
const getStarsText = (stars) => {
  if (!stars || stars.length === 0) return '未知';
  return stars.map(s => s.name).join('、');
};

// 渲染磁力链接标题
const renderMagnetTitle = (magnet) => {
  const badges = [];
  if (magnet.isHD) badges.push('[HD]');
  if (magnet.hasSubtitle) badges.push('[字幕]');
  return `${badges.join(' ')} ${magnet.title}`;
};

// 复制磁力链接
const copyMagnet = async (magnet) => {
  try {
    await navigator.clipboard.writeText(magnet.link);
    message.success('磁力链接已复制到剪贴板！');
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = magnet.link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    message.success('磁力链接已复制到剪贴板！');
  }
};

// 下载磁力链接
const downloadMagnet = (magnet) => {
  // 创建下载链接
  const link = document.createElement('a');
  link.href = magnet.link;
  link.download = `${magnet.title}.magnet`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 尝试直接打开磁力链接
  window.location.href = magnet.link;
  message.info('正在尝试打开磁力链接...');
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f0f2f5;
}

.layout {
  min-height: 100vh;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
}

.content {
  padding: 24px;
  display: flex;
  justify-content: center;
}

.main-wrapper {
  width: 100%;
  max-width: 1200px;
}

.search-section {
  margin-bottom: 24px;
}

.search-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-alert {
  margin-bottom: 24px;
  border-radius: 8px;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.movie-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.movie-cover {
  flex-shrink: 0;
}

.movie-cover :deep(.ant-image) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.movie-cover :deep(.ant-image-img) {
  width: 200px;
  height: auto;
  border-radius: 8px;
}

.movie-details {
  flex: 1;
  min-width: 300px;
}

.movie-details h3 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #1890ff;
}

.action-buttons {
  margin-top: 20px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.similar-item {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.similar-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.similar-cover :deep(.ant-image-img) {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.similar-title {
  padding: 8px;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 32px;
  background: #fff;
  border-radius: 0 0 8px 8px;
}

.magnet-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.magnet-filters .ant-checkbox-wrapper {
  display: flex;
  align-items: center;
}

.magnet-filters .ant-select {
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 16px;
  }
  
  .movie-content {
    flex-direction: column;
  }
  
  .movie-cover :deep(.ant-image-img) {
    width: 100%;
    max-width: 300px;
  }
  
  .similar-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .magnet-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 16px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .similar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>  
