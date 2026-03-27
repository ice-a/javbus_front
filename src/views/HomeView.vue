<template>
  <div class="gallery-shell">
    <header class="gallery-header">
      <div class="header-brand">
        <span class="brand-mark">JAV</span>
        <h1 class="brand-title">影片资料馆</h1>
      </div>

      <div class="header-nav">
        <a href="https://nav.020417.xyz/" target="_blank" class="nav-link">导航站</a>
        <a href="https://020417.xyz/" target="_blank" class="nav-link">题库站</a>
      </div>
    </header>

    <section class="gallery-search">
      <div class="search-container">
        <h2 class="search-heading">探索你的影片库</h2>
        <p class="search-subheading">输入番号，一键直达</p>

        <div class="search-box">
          <a-input
            v-model:value="keyword"
            size="large"
            class="search-input"
            placeholder="输入影片编号，例如：PPBD-145"
            :disabled="loading"
            @pressEnter="search"
          >
            <template #prefix>
              <SearchOutlined class="search-icon" />
            </template>
          </a-input>

          <a-button
            type="primary"
            size="large"
            class="search-btn"
            :loading="loading"
            :disabled="!keyword.trim() || loading"
            @click="search"
          >
            {{ loading ? '检索中' : '搜索' }}
          </a-button>

          <a-button
            v-if="movieData || magnets.length > 0 || error"
            size="large"
            class="clear-btn"
            @click="clearResults"
          >
            清空
          </a-button>
        </div>

        <div class="example-chips">
          <button
            v-for="item in exampleCodes"
            :key="item"
            type="button"
            class="chip"
            @click="applyExample(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </section>

    <a-alert v-if="error" :message="error" type="error" show-icon class="error-toast" />

    <section v-if="movieData" class="gallery-content">
      <div class="main-poster">
        <div class="poster-card">
          <div class="poster-frame">
            <img
              v-if="movieData.img"
              class="poster-img"
              :src="movieData.img"
              :alt="movieData.title"
              referrerpolicy="no-referrer"
            />
            <div v-else class="poster-placeholder">
              <PictureOutlined />
            </div>
          </div>

          <div class="poster-overlay">
            <span class="overlay-code">{{ movieData.id }}</span>
            <a-button
              type="primary"
              block
              class="magnet-btn"
              :loading="magnetsLoading"
              @click="loadMagnets"
            >
              <ThunderboltOutlined />
              {{ magnetsLoading ? '加载中...' : '磁力链接' }}
            </a-button>
          </div>
        </div>
      </div>

      <div class="movie-info">
        <div class="info-header">
          <span class="info-tag">MOVIE</span>
          <h2 class="movie-title">{{ movieData.title }}</h2>
        </div>

        <div class="info-meta">
          <div class="meta-item">
            <CalendarOutlined />
            <span>{{ movieData.date || '未知' }}</span>
          </div>
          <div class="meta-item">
            <ClockCircleOutlined />
            <span>{{ formatDuration(movieData.videoLength) }}</span>
          </div>
          <div class="meta-item">
            <VideoCameraOutlined />
            <span>{{ movieData.director?.name || '未知' }}</span>
          </div>
        </div>

        <div class="info-tags">
          <span class="tag" v-for="genre in movieData.genres || []" :key="genre.id || genre.name">
            {{ genre.name }}
          </span>
          <span v-if="!movieData.genres?.length" class="tag tag-muted">未知</span>
        </div>

        <div class="info-cast">
          <h4 class="cast-title">演员</h4>
          <div class="cast-list">
            <span
              class="cast-item"
              v-for="star in movieData.stars || []"
              :key="star.id || star.name"
            >
              {{ star.name }}
            </span>
            <span v-if="!movieData.stars?.length" class="cast-item cast-muted">未知</span>
          </div>
        </div>

        <div class="info-details">
          <div class="detail-row">
            <span class="detail-label">制作商</span>
            <span class="detail-value">{{ movieData.producer?.name || '未知' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">发行商</span>
            <span class="detail-value">{{ movieData.publisher?.name || '未知' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">系列</span>
            <span class="detail-value">{{ movieData.series?.name || '未知' }}</span>
          </div>
        </div>
      </div>

      <section v-if="movieData.similarMovies?.length" class="similar-section">
        <h3 class="section-title">相似影片</h3>
        <div class="similar-grid">
          <button
            v-for="similar in movieData.similarMovies"
            :key="similar.id"
            type="button"
            class="similar-card"
            @click="searchSimilar(similar.id)"
          >
            <div class="similar-img-wrap">
              <img
                v-if="similar.img"
                class="similar-img"
                :src="similar.img"
                :alt="similar.title"
                referrerpolicy="no-referrer"
              />
              <div v-else class="similar-placeholder">
                <PictureOutlined />
              </div>
            </div>
            <div class="similar-info">
              <span class="similar-code">{{ similar.id }}</span>
            </div>
          </button>
        </div>
      </section>

      <section v-if="magnets.length > 0" class="magnet-section">
        <div class="magnet-header">
          <h3 class="section-title">磁力链接</h3>
          <span class="magnet-count">{{ filteredMagnets.length }} / {{ magnets.length }}</span>
        </div>

        <div class="magnet-filters">
          <a-checkbox v-model:checked="showOnlyHD">仅高清</a-checkbox>
          <a-checkbox v-model:checked="showOnlySubtitle">仅字幕</a-checkbox>
        </div>

        <div class="magnet-list">
          <div v-for="item in filteredMagnets" :key="item.link" class="magnet-item">
            <div class="magnet-flags">
              <span v-if="item.isHD" class="flag flag-hd">HD</span>
              <span v-if="item.hasSubtitle" class="flag flag-sub">字幕</span>
            </div>
            <div class="magnet-info">
              <span class="magnet-title">{{ item.title }}</span>
              <span class="magnet-meta">{{ item.size }} · {{ item.date }}</span>
            </div>
            <div class="magnet-actions">
              <a-button size="small" @click="copyMagnet(item)">
                <CopyOutlined />
              </a-button>
              <a-button type="primary" size="small" @click="downloadMagnet(item)">
                <ExportOutlined />
              </a-button>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  PictureOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  CopyOutlined,
  ExportOutlined,
} from '@ant-design/icons-vue'

const exampleCodes = ['PPBD-145', 'SSIS-001', 'IPX-811', 'JUL-757']

const keyword = ref('')
const loading = ref(false)
const magnetsLoading = ref(false)
const error = ref('')
const movieData = ref(null)
const magnets = ref([])
const showOnlyHD = ref(false)
const showOnlySubtitle = ref(false)

function getErrorMessage(err, fallback) {
  return err instanceof Error ? err.message : fallback
}

async function parseApiResponse(response, fallbackMessage) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  if (isJson) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || fallbackMessage)
    }

    return data
  }

  const rawText = await response.text()
  const preview = rawText.trim().slice(0, 120)
  const looksLikeHtml = /^<!doctype|^<html/i.test(preview)

  if (looksLikeHtml) {
    throw new Error('接口返回了 HTML，不是 JSON。请确认本地开发代理是否已生效。')
  }

  throw new Error(preview || fallbackMessage)
}

const filteredMagnets = computed(() => {
  let result = [...magnets.value]

  if (showOnlyHD.value) {
    result = result.filter((item) => item.isHD)
  }

  if (showOnlySubtitle.value) {
    result = result.filter((item) => item.hasSubtitle)
  }

  return result
})

const applyExample = (value) => {
  keyword.value = value
  search()
}

const search = async () => {
  if (!keyword.value.trim()) return

  loading.value = true
  error.value = ''
  movieData.value = null
  magnets.value = []

  try {
    const response = await fetch(`/api/movies/${keyword.value.trim()}`)
    const data = await parseApiResponse(response, '搜索失败，请检查编号是否正确')
    movieData.value = data
    message.success('搜索成功')
  } catch (err) {
    const fallback = '搜索出错，请稍后重试'
    error.value = getErrorMessage(err, fallback)
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

const loadMagnets = async () => {
  if (!movieData.value) return

  magnetsLoading.value = true
  error.value = ''

  try {
    const { gid, uc, id } = movieData.value
    const response = await fetch(`/api/magnets/${id}?gid=${gid}&uc=${uc}`)
    const data = await parseApiResponse(response, '加载磁力链接失败')
    magnets.value = Array.isArray(data) ? data : []
    message.success(`成功加载 ${magnets.value.length} 条磁力链接`)
  } catch (err) {
    const fallback = '加载磁力链接出错'
    error.value = getErrorMessage(err, fallback)
    message.error(error.value)
  } finally {
    magnetsLoading.value = false
  }
}

const searchSimilar = (id) => {
  keyword.value = id
  search()
}

const clearResults = () => {
  keyword.value = ''
  error.value = ''
  movieData.value = null
  magnets.value = []
}

const formatDuration = (minutes) => {
  if (!minutes) return '未知'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}

const copyMagnet = async (magnet) => {
  try {
    await navigator.clipboard.writeText(magnet.link)
    message.success('磁力链接已复制')
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = magnet.link
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    message.success('磁力链接已复制')
  }
}

const downloadMagnet = (magnet) => {
  window.location.href = magnet.link
  message.info('正在尝试打开磁力链接')
}
</script>

<style scoped>
.gallery-shell {
  --bg-deep: #0a0a0f;
  --bg-card: #14141c;
  --bg-elevated: #1c1c28;
  --text-primary: #f5f5f7;
  --text-secondary: #8e8e93;
  --text-muted: #636366;
  --accent: #ff6b35;
  --accent-soft: #ff8c5a;
  --accent-glow: rgba(255, 107, 53, 0.15);
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);

  min-height: 100vh;
  background: var(--bg-deep);
  color: var(--text-primary);
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: linear-gradient(180deg, rgba(20, 20, 28, 0.95) 0%, transparent 100%);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--accent) 0%, #ff8c5a 100%);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 10px 18px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.gallery-search {
  padding: 80px 32px 60px;
  text-align: center;
  background: radial-gradient(ellipse at top, rgba(255, 107, 53, 0.08) 0%, transparent 60%);
}

.search-heading {
  margin: 0 0 8px;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff 0%, #ccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-subheading {
  margin: 0 0 36px;
  color: var(--text-secondary);
  font-size: 16px;
}

.search-box {
  display: flex;
  justify-content: center;
  gap: 12px;
  max-width: 640px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.search-box .search-input {
  flex: 1;
  min-width: 280px;
}

.search-box :deep(.ant-input) {
  height: 54px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 16px;
}

.search-box :deep(.ant-input::placeholder) {
  color: var(--text-muted);
}

.search-box :deep(.ant-input:focus, .ant-input:hover) {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-icon {
  color: var(--text-muted);
  font-size: 18px;
}

.search-btn {
  height: 54px;
  padding: 0 32px;
  background: linear-gradient(135deg, var(--accent) 0%, #ff8c5a 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

.clear-btn {
  height: 54px;
  padding: 0 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.example-chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.chip {
  padding: 8px 16px;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-glow);
}

.error-toast {
  max-width: 640px;
  margin: 20px auto;
}

.error-toast :deep(.ant-alert) {
  border-radius: 12px;
}

.gallery-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 60px;
}

.main-poster {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.poster-card {
  border-radius: 20px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.poster-frame {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.poster-card:hover .poster-img {
  transform: scale(1.05);
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  color: var(--text-muted);
  font-size: 48px;
}

.poster-overlay {
  padding: 16px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
}

.overlay-code {
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.magnet-btn {
  height: 44px;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-header {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.info-tag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--accent-glow);
  color: var(--accent);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

.movie-title {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.meta-item :deep(.anticon) {
  color: var(--accent);
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 14px;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid var(--border);
}

.tag-muted {
  color: var(--text-muted);
}

.info-cast {
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.cast-title {
  margin: 0 0 12px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cast-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cast-item {
  padding: 8px 14px;
  background: linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%);
  color: var(--accent-soft);
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.cast-muted {
  color: var(--text-muted);
  background: var(--bg-elevated);
  border-color: var(--border);
}

.info-details {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border);
}

.detail-label {
  color: var(--text-muted);
  font-size: 13px;
}

.detail-value {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.similar-section {
  grid-column: 1 / -1;
  margin-top: 20px;
}

.section-title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.similar-card {
  padding: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.similar-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.similar-img-wrap {
  aspect-ratio: 3/4;
  overflow: hidden;
}

.similar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.similar-card:hover .similar-img {
  transform: scale(1.08);
}

.similar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  color: var(--text-muted);
  font-size: 32px;
}

.similar-info {
  padding: 12px;
}

.similar-code {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.05em;
}

.magnet-section {
  grid-column: 1 / -1;
  margin-top: 20px;
  padding: 24px;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border);
}

.magnet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.magnet-count {
  color: var(--text-muted);
  font-size: 13px;
}

.magnet-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.magnet-list {
  display: grid;
  gap: 10px;
}

.magnet-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: var(--bg-elevated);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.magnet-flags {
  display: flex;
  gap: 6px;
  min-width: 70px;
}

.flag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.flag-hd {
  color: #fff;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.flag-sub {
  color: var(--accent);
  background: var(--accent-glow);
}

.magnet-info {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 4px;
}

.magnet-title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.magnet-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.magnet-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 900px) {
  .gallery-content {
    grid-template-columns: 1fr;
  }

  .main-poster {
    position: relative;
    top: 0;
    max-width: 400px;
    margin: 0 auto;
  }

  .gallery-search {
    padding: 40px 20px;
  }

  .gallery-header {
    padding: 16px 20px;
  }

  .gallery-content {
    padding: 0 20px 40px;
  }
}
</style>
