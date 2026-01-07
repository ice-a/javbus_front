<template>
  <div class="home">
    <!-- 搜索区域 -->
    <div class="search-section card">
      <h2>搜索视频</h2>
      <div class="search-form">
        <div class="form-group">
          <input 
            v-model="keyword" 
            type="text" 
            class="input" 
            placeholder="输入视频编号，例如：PPBD-145"
            @keyup.enter="search"
          />
        </div>
        <div class="form-actions">
          <button @click="search" :disabled="loading || !keyword" class="btn">
            {{ loading ? '搜索中...' : '搜索' }}
          </button>
          <button @click="clearResults" class="btn btn-secondary" v-if="movieData || magnets.length > 0">
            清空结果
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- 搜索结果 -->
    <div v-if="movieData" class="results-section">
      <!-- 电影信息 -->
      <div class="movie-info card">
        <h2>视频信息</h2>
        <div class="movie-content">
          <div class="movie-cover" v-if="movieData.img">
            <img :src="movieData.img" :alt="movieData.title" />
          </div>
          <div class="movie-details">
            <h3>{{ movieData.title }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">编号：</span>
                <span class="value">{{ movieData.id }}</span>
              </div>
              <div class="info-item">
                <span class="label">日期：</span>
                <span class="value">{{ movieData.date }}</span>
              </div>
              <div class="info-item">
                <span class="label">时长：</span>
                <span class="value">{{ formatDuration(movieData.videoLength) }}</span>
              </div>
              <div class="info-item" v-if="movieData.director">
                <span class="label">导演：</span>
                <span class="value">{{ movieData.director.name }}</span>
              </div>
              <div class="info-item" v-if="movieData.producer">
                <span class="label">制作商：</span>
                <span class="value">{{ movieData.producer.name }}</span>
              </div>
              <div class="info-item" v-if="movieData.publisher">
                <span class="label">发行商：</span>
                <span class="value">{{ movieData.publisher.name }}</span>
              </div>
              <div class="info-item" v-if="movieData.series">
                <span class="label">系列：</span>
                <span class="value">{{ movieData.series.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">类别：</span>
                <span class="value">{{ getGenresText(movieData.genres) }}</span>
              </div>
              <div class="info-item">
                <span class="label">演员：</span>
                <span class="value">{{ getStarsText(movieData.stars) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="loadMagnets" class="btn" :disabled="magnetsLoading">
            {{ magnetsLoading ? '加载中...' : '下载磁力链接' }}
          </button>
        </div>
      </div>

      <!-- 相似视频 -->
      <div v-if="movieData.similarMovies && movieData.similarMovies.length > 0" class="similar-movies card">
        <h3>相似视频</h3>
        <div class="similar-grid">
          <div 
            v-for="similar in movieData.similarMovies" 
            :key="similar.id" 
            class="similar-item"
            @click="searchSimilar(similar.id)"
          >
            <div class="similar-cover">
              <img :src="similar.img" :alt="similar.title" />
            </div>
            <div class="similar-title">{{ similar.title }}</div>
          </div>
        </div>
      </div>

      <!-- 磁力链接列表 -->
      <div v-if="magnets.length > 0" class="magnets-section card">
        <h3>磁力链接 ({{ magnets.length }})</h3>
        <div class="magnet-filters">
          <label>
            <input type="checkbox" v-model="showOnlyHD" />
            只显示高清
          </label>
          <label>
            <input type="checkbox" v-model="showOnlySubtitle" />
            只显示有字幕
          </label>
          <select v-model="sortBy" class="input" style="width: auto;">
            <option value="size">按大小排序</option>
            <option value="date">按时间排序</option>
            <option value="shareDate">按分享时间排序</option>
          </select>
        </div>
        <div class="magnet-list">
          <div 
            v-for="magnet in filteredMagnets" 
            :key="magnet.id" 
            class="magnet-item"
          >
            <div class="magnet-info">
              <div class="magnet-title">
                <span :class="{ 'hd-badge': magnet.isHD }" v-if="magnet.isHD">HD</span>
                <span :class="{ 'subtitle-badge': magnet.hasSubtitle }" v-if="magnet.hasSubtitle">字幕</span>
                {{ magnet.title }}
              </div>
              <div class="magnet-details">
                <span>大小：{{ magnet.size }}</span>
                <span>分享时间：{{ magnet.shareDate }}</span>
              </div>
            </div>
            <div class="magnet-actions">
              <button @click="copyMagnet(magnet)" class="btn btn-secondary">复制链接</button>
              <button @click="downloadMagnet(magnet)" class="btn">下载</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
    const response = await fetch(`/api/movies/${keyword.value.trim()}`);
    if (!response.ok) {
      throw new Error('搜索失败，请检查编号是否正确');
    }
    const data = await response.json();
    movieData.value = data;
  } catch (err) {
    error.value = err.message || '搜索出错，请稍后重试';
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
    const response = await fetch(`/api/magnets/${movieData.value.id}?gid=${gid}&uc=${uc}&sortBy=${sortBy.value}&sortOrder=asc`);
    if (!response.ok) {
      throw new Error('加载磁力链接失败');
    }
    const data = await response.json();
    magnets.value = data;
  } catch (err) {
    error.value = err.message || '加载磁力链接出错';
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

// 复制磁力链接
const copyMagnet = async (magnet) => {
  try {
    await navigator.clipboard.writeText(magnet.link);
    alert('磁力链接已复制到剪贴板！');
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = magnet.link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('磁力链接已复制到剪贴板！');
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
};
</script>

<style scoped>
.home {
  max-width: 100%;
}

.search-section h2,
.movie-info h2,
.similar-movies h3,
.magnets-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 电影信息样式 */
.movie-content {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.movie-cover {
  flex-shrink: 0;
}

.movie-cover img {
  width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.movie-details {
  flex: 1;
  min-width: 300px;
}

.movie-details h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: baseline;
}

.label {
  font-weight: 600;
  color: #666;
  min-width: 70px;
}

.value {
  color: #333;
}

.action-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 相似视频样式 */
.similar-movies {
  margin-top: 1rem;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.similar-item {
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.similar-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.similar-cover img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.similar-title {
  padding: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.6em;
}

/* 磁力链接样式 */
.magnets-section {
  margin-top: 1rem;
}

.magnet-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.magnet-filters label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.magnet-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.magnet-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  gap: 1rem;
  flex-wrap: wrap;
}

.magnet-info {
  flex: 1;
  min-width: 200px;
}

.magnet-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.hd-badge {
  background: #42b983;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.subtitle-badge {
  background: #ff9800;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.magnet-details {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.magnet-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
  }
  
  .movie-cover img {
    width: 100%;
    max-width: 300px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .magnet-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .magnet-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .similar-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>