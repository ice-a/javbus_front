<template>
  <div class="catalog-shell">
    <header class="catalog-header">
      <div class="header-main">
        <p class="eyebrow">ARCHIVE ACCESS</p>
        <h1 class="catalog-title">JAVBUS 影片资料馆</h1>
        <p class="catalog-summary">
          以编目视图整理番号、元信息、相似影片与磁链结果，减少视觉噪声，保留检索效率。
        </p>
      </div>

      <div class="header-side">
        <section class="utility-card">
          <div class="card-head utility-head">
            <h3>馆内工具</h3>
            <span>辅助入口</span>
          </div>

          <div class="utility-list">
            <a
              class="utility-item utility-link"
              href="https://nav.020417.xyz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="utility-label">导航站</span>
              <strong class="utility-value">nav.020417.xyz</strong>
            </a>
            <a
              class="utility-item utility-link"
              href="https://020417.xyz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="utility-label">题库站</span>
              <strong class="utility-value">020417.xyz</strong>
            </a>
          </div>
        </section>
      </div>
    </header>

    <section class="search-deck">
      <div class="search-intro">
        <span class="intro-chip">检索台</span>
        <p class="intro-copy">输入番号后直接展开档案页。示例编号保留在下方，方便快速校验界面状态。</p>
      </div>

      <div class="search-form">
        <label class="field-label" for="movie-code">影片编号</label>
        <a-input
          id="movie-code"
          v-model:value="keyword"
          size="large"
          class="search-input"
          placeholder="输入影片编号，例如：PPBD-145"
          :disabled="loading"
          @pressEnter="search"
        />

        <div class="search-actions">
          <a-button
            type="primary"
            size="large"
            class="search-button"
            :loading="loading"
            :disabled="!keyword.trim() || loading"
            @click="search"
          >
            {{ loading ? '检索中...' : '检索档案' }}
          </a-button>
          <a-button
            v-if="movieData || magnets.length > 0 || error"
            size="large"
            class="reset-button"
            @click="clearResults"
          >
            清空
          </a-button>
        </div>
      </div>

      <div class="example-strip">
        <span class="strip-label">示例编号</span>
        <button
          v-for="item in exampleCodes"
          :key="item"
          type="button"
          class="example-button"
          @click="applyExample(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <a-alert
      v-if="error"
      :message="error"
      type="error"
      show-icon
      class="error-banner"
    />

    <section v-if="movieData" class="archive-layout">
      <aside class="archive-sidebar">
        <section class="sidebar-card poster-card">
          <div class="poster-frame">
            <img
              v-if="!movieCoverState.failed && movieCoverState.src"
              class="poster-image"
              :src="movieCoverState.src"
              :alt="movieData.title"
              referrerpolicy="no-referrer"
              @error="handleMovieImageError"
            />
            <div v-else class="poster-fallback">随机图加载失败</div>
          </div>

          <a-button
            type="primary"
            size="large"
            block
            class="magnet-button"
            :loading="magnetsLoading"
            @click="loadMagnets"
          >
            {{ magnetsLoading ? '加载磁链中...' : '加载磁力链接' }}
          </a-button>
        </section>

        <section class="sidebar-card meta-card">
          <div class="card-head">
            <h3>目录卡</h3>
            <span>基础字段</span>
          </div>

          <div class="catalog-list">
            <div class="catalog-row">
              <span>编号</span>
              <strong>{{ movieData.id || '未知' }}</strong>
            </div>
            <div class="catalog-row">
              <span>日期</span>
              <strong>{{ movieData.date || '未知' }}</strong>
            </div>
            <div class="catalog-row">
              <span>时长</span>
              <strong>{{ formatDuration(movieData.videoLength) }}</strong>
            </div>
            <div class="catalog-row">
              <span>导演</span>
              <strong>{{ movieData.director?.name || '未知' }}</strong>
            </div>
            <div class="catalog-row">
              <span>制作商</span>
              <strong>{{ movieData.producer?.name || '未知' }}</strong>
            </div>
            <div class="catalog-row">
              <span>发行商</span>
              <strong>{{ movieData.publisher?.name || '未知' }}</strong>
            </div>
            <div class="catalog-row">
              <span>系列</span>
              <strong>{{ movieData.series?.name || '未知' }}</strong>
            </div>
          </div>
        </section>
      </aside>

      <div class="archive-main">
        <section class="archive-card title-card">
          <div class="title-topline">
            <span class="section-mark">档案抬头</span>
            <span class="archive-code">{{ movieData.id || 'NO-ID' }}</span>
          </div>
          <h2 class="movie-title">{{ movieData.title || '未命名影片' }}</h2>

          <div class="metric-grid">
            <div v-for="fact in movieFacts" :key="fact.label" class="metric-box">
              <span class="metric-label">{{ fact.label }}</span>
              <strong class="metric-value">{{ fact.value }}</strong>
            </div>
          </div>
        </section>

        <section class="archive-card taxonomy-card">
          <div class="card-head">
            <h3>影片信息</h3>
            <span>分类与人员</span>
          </div>

          <div class="detail-grid">
            <div class="detail-box">
              <span class="detail-label">类别</span>
              <div class="token-list">
                <span
                  v-for="genre in movieData.genres || []"
                  :key="genre.id || genre.name"
                  class="token"
                >
                  {{ genre.name }}
                </span>
                <span v-if="!movieData.genres?.length" class="token token-muted">未知</span>
              </div>
            </div>

            <div class="detail-box">
              <span class="detail-label">演员</span>
              <div class="token-list">
                <span
                  v-for="star in movieData.stars || []"
                  :key="star.id || star.name"
                  class="token token-accent"
                >
                  {{ star.name }}
                </span>
                <span v-if="!movieData.stars?.length" class="token token-muted">未知</span>
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="movieData.similarMovies?.length"
          class="archive-card similar-card-panel"
        >
          <div class="card-head">
            <h3>相似影片</h3>
            <span>继续检索</span>
          </div>

          <div class="similar-grid">
            <button
              v-for="similar in movieData.similarMovies"
              :key="similar.id"
              type="button"
              class="similar-entry"
              @click="searchSimilar(similar.id)"
            >
              <div class="similar-cover">
                <img
                  v-if="
                    similarCoverStates[similar.id] &&
                    !similarCoverStates[similar.id].failed &&
                    similarCoverStates[similar.id].src
                  "
                  class="similar-image"
                  :src="similarCoverStates[similar.id].src"
                  :alt="similar.title"
                  referrerpolicy="no-referrer"
                  @error="handleSimilarImageError(similar.id)"
                />
                <div v-else class="similar-fallback">随机图加载失败</div>
              </div>

              <div class="similar-copy">
                <span class="similar-id">{{ similar.id }}</span>
                <span class="similar-title">{{ similar.title }}</span>
              </div>
            </button>
          </div>
        </section>

        <section v-if="magnets.length > 0" class="archive-card magnet-panel">
          <div class="card-head">
            <h3>磁力链接</h3>
            <span>{{ filteredMagnets.length }} / {{ magnets.length }} 条记录</span>
          </div>

          <div class="filter-bar">
            <a-checkbox v-model:checked="showOnlyHD">仅高清</a-checkbox>
            <a-checkbox v-model:checked="showOnlySubtitle">仅字幕</a-checkbox>
            <a-select
              v-model:value="sortBy"
              class="sort-select"
              @change="handleSortChange"
            >
              <a-select-option value="size">按大小排序</a-select-option>
              <a-select-option value="date">按日期排序</a-select-option>
              <a-select-option value="shareDate">按分享时间排序</a-select-option>
            </a-select>
          </div>

          <div class="magnet-table">
            <article v-for="item in filteredMagnets" :key="item.link" class="magnet-row">
              <div class="magnet-col magnet-col-main">
                <div class="flag-row">
                  <span v-if="item.isHD" class="flag flag-hd">HD</span>
                  <span v-if="item.hasSubtitle" class="flag flag-sub">字幕</span>
                </div>
                <h4 class="magnet-name">{{ item.title || '未命名资源' }}</h4>
              </div>

              <div class="magnet-col magnet-col-meta">
                <span>大小 {{ item.size || '未知' }}</span>
                <span>日期 {{ item.date || '未知' }}</span>
                <span>分享 {{ item.shareDate || '未知' }}</span>
              </div>

              <div class="magnet-col magnet-col-actions">
                <a-button size="small" @click="copyMagnet(item)">复制</a-button>
                <a-button type="primary" size="small" @click="downloadMagnet(item)">
                  打开
                </a-button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';

const RANDOM_IMAGE_URL = 'https://i.mukyu.ru/random?r18=1';
const exampleCodes = ['PPBD-145', 'SSIS-001', 'IPX-811', 'JUL-757'];

const keyword = ref('');
const loading = ref(false);
const magnetsLoading = ref(false);
const error = ref('');
const movieData = ref(null);
const magnets = ref([]);
const showOnlyHD = ref(false);
const showOnlySubtitle = ref(false);
const sortBy = ref('size');
const movieCoverState = ref(createImageState());
const similarCoverStates = ref({});

function getRandomImageUrl(key = '') {
  const cacheBust = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const seed = key ? `&seed=${encodeURIComponent(key)}` : '';
  return `${RANDOM_IMAGE_URL}${seed}&t=${cacheBust}`;
}

function createImageState(src = '', key = '') {
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';

  if (normalizedSrc) {
    return {
      src: normalizedSrc,
      randomTried: false,
      failed: false,
    };
  }

  return {
    src: getRandomImageUrl(key),
    randomTried: true,
    failed: false,
  };
}

function resetImageStates() {
  movieCoverState.value = createImageState();
  similarCoverStates.value = {};
}

function initImageStates(data) {
  movieCoverState.value = createImageState(data?.img, data?.id || 'movie');
  similarCoverStates.value = Object.fromEntries(
    (data?.similarMovies || []).map((similar) => [
      similar.id,
      createImageState(similar.img, similar.id),
    ]),
  );
}

function useRandomFallback(state, key = '') {
  if (!state || state.failed) return;

  if (!state.randomTried) {
    state.src = getRandomImageUrl(key);
    state.randomTried = true;
    return;
  }

  state.src = '';
  state.failed = true;
}

function getErrorMessage(err, fallback) {
  return err instanceof Error ? err.message : fallback;
}

async function parseApiResponse(response, fallbackMessage) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (isJson) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || fallbackMessage);
    }

    return data;
  }

  const rawText = await response.text();
  const preview = rawText.trim().slice(0, 120);
  const looksLikeHtml = /^<!doctype|^<html/i.test(preview);

  if (looksLikeHtml) {
    throw new Error('接口返回了 HTML，不是 JSON。请确认本地开发代理是否已生效。');
  }

  throw new Error(preview || fallbackMessage);
}

const movieFacts = computed(() => {
  if (!movieData.value) return [];

  return [
    { label: '日期', value: movieData.value.date || '未知' },
    { label: '时长', value: formatDuration(movieData.value.videoLength) },
    { label: '导演', value: movieData.value.director?.name || '未知' },
  ];
});

const filteredMagnets = computed(() => {
  let result = [...magnets.value];

  if (showOnlyHD.value) {
    result = result.filter((item) => item.isHD);
  }

  if (showOnlySubtitle.value) {
    result = result.filter((item) => item.hasSubtitle);
  }

  result.sort((a, b) => {
    if (sortBy.value === 'size') {
      return (b.numberSize || 0) - (a.numberSize || 0);
    }

    if (sortBy.value === 'date') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    }

    if (sortBy.value === 'shareDate') {
      return new Date(b.shareDate || 0) - new Date(a.shareDate || 0);
    }

    return 0;
  });

  return result;
});

const handleMovieImageError = () => {
  useRandomFallback(movieCoverState.value, movieData.value?.id || 'movie');
};

const handleSimilarImageError = (id) => {
  useRandomFallback(similarCoverStates.value[id], id);
};

const applyExample = (value) => {
  keyword.value = value;
  search();
};

const search = async () => {
  if (!keyword.value.trim()) return;

  loading.value = true;
  error.value = '';
  movieData.value = null;
  magnets.value = [];
  resetImageStates();

  try {
    const response = await fetch(`/api/movies/${keyword.value.trim()}`);
    const data = await parseApiResponse(response, '搜索失败，请检查编号是否正确');
    movieData.value = data;
    initImageStates(data);
    message.success('搜索成功');
  } catch (err) {
    const fallback = '搜索出错，请稍后重试';
    error.value = getErrorMessage(err, fallback);
    message.error(error.value);
  } finally {
    loading.value = false;
  }
};

const loadMagnets = async () => {
  if (!movieData.value) return;

  magnetsLoading.value = true;
  error.value = '';

  try {
    const { gid, uc, id } = movieData.value;
    const response = await fetch(
      `/api/magnets/${id}?gid=${gid}&uc=${uc}&sortBy=${sortBy.value}&sortOrder=asc`,
    );
    const data = await parseApiResponse(response, '加载磁力链接失败');
    magnets.value = Array.isArray(data) ? data : [];
    message.success(`成功加载 ${magnets.value.length} 条磁力链接`);
  } catch (err) {
    const fallback = '加载磁力链接出错';
    error.value = getErrorMessage(err, fallback);
    message.error(error.value);
  } finally {
    magnetsLoading.value = false;
  }
};

const searchSimilar = (id) => {
  keyword.value = id;
  search();
};

const clearResults = () => {
  keyword.value = '';
  error.value = '';
  movieData.value = null;
  magnets.value = [];
  resetImageStates();
};

const handleSortChange = () => {
  if (magnets.value.length > 0 && movieData.value) {
    loadMagnets();
  }
};

const formatDuration = (minutes) => {
  if (!minutes) return '未知';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
};

const copyMagnet = async (magnet) => {
  try {
    await navigator.clipboard.writeText(magnet.link);
    message.success('磁力链接已复制');
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = magnet.link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    message.success('磁力链接已复制');
  }
};

const downloadMagnet = (magnet) => {
  window.location.href = magnet.link;
  message.info('正在尝试打开磁力链接');
};
</script>

<style scoped>
.catalog-shell {
  --paper: #f1ebdd;
  --paper-strong: #f8f4ea;
  --ink: #25211b;
  --ink-soft: #655c4f;
  --line: rgba(58, 49, 38, 0.14);
  --line-strong: rgba(58, 49, 38, 0.24);
  --accent: #6b4a2e;
  --accent-soft: #d9c7a7;
  min-height: 100vh;
  padding: 24px 24px 48px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent 180px),
    linear-gradient(180deg, #f5f0e4 0%, #ebe3d4 100%);
  color: var(--ink);
}

.catalog-header,
.search-deck,
.error-banner,
.archive-layout {
  width: min(1240px, 100%);
  margin: 0 auto;
}

.catalog-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  padding: 0 0 20px;
  border-bottom: 1px solid var(--line-strong);
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.catalog-title {
  margin: 0;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.catalog-summary {
  max-width: 780px;
  margin: 14px 0 0;
  color: var(--ink-soft);
  font-size: 15px;
  line-height: 1.8;
}

.header-side {
  display: flex;
  align-items: stretch;
}

.utility-card {
  width: 100%;
  padding: 16px;
  background: rgba(255, 250, 242, 0.7);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.utility-head {
  padding-bottom: 10px;
}

.utility-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.utility-item {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 253, 248, 0.82);
  border: 1px solid rgba(58, 49, 38, 0.08);
  border-radius: 12px;
}

.utility-link {
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.utility-link:hover {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(58, 49, 38, 0.22);
}

.utility-label {
  color: var(--ink-soft);
  font-size: 12px;
}

.utility-value {
  color: var(--ink);
  font-size: 14px;
  line-height: 1.45;
}

.search-deck {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  padding: 22px 0 24px;
  border-bottom: 1px solid var(--line);
}

.search-intro {
  display: grid;
  gap: 10px;
}

.intro-chip {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  color: var(--accent);
  background: rgba(107, 74, 46, 0.08);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.intro-copy {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.75;
}

.search-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px 14px;
  align-items: end;
}

.field-label {
  grid-column: 1 / -1;
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.search-input :deep(.ant-input) {
  height: 50px;
  background: rgba(255, 252, 247, 0.88);
  border-color: rgba(58, 49, 38, 0.18);
}

.search-actions {
  display: flex;
  gap: 10px;
}

.example-strip {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.strip-label {
  color: var(--ink-soft);
  font-size: 12px;
}

.example-button {
  height: 34px;
  padding: 0 12px;
  color: var(--accent);
  background: rgba(255, 251, 245, 0.92);
  border: 1px solid rgba(107, 74, 46, 0.16);
  border-radius: 999px;
  cursor: pointer;
}

.example-button:hover {
  border-color: rgba(107, 74, 46, 0.3);
}

.error-banner {
  margin-top: 18px;
}

.error-banner :deep(.ant-alert) {
  border-radius: 14px;
}

.archive-layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.archive-sidebar {
  display: grid;
  gap: 16px;
  align-self: start;
}

.sidebar-card,
.archive-card {
  background: rgba(250, 246, 238, 0.78);
  border: 1px solid var(--line);
  border-radius: 18px;
}

.sidebar-card {
  padding: 16px;
}

.poster-frame {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(107, 74, 46, 0.05);
}

.poster-image,
.poster-fallback {
  width: 100%;
  min-height: 420px;
}

.poster-image {
  display: block;
  object-fit: cover;
}

.poster-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--ink-soft);
  text-align: center;
}

.magnet-button {
  margin-top: 14px;
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.card-head h3 {
  margin: 0;
  font-size: 18px;
}

.card-head span {
  color: var(--ink-soft);
  font-size: 12px;
}

.catalog-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.catalog-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(58, 49, 38, 0.1);
}

.catalog-row span {
  color: var(--ink-soft);
  font-size: 13px;
}

.catalog-row strong {
  color: var(--ink);
  font-size: 13px;
  text-align: right;
}

.archive-main {
  display: grid;
  gap: 16px;
}

.archive-card {
  padding: 18px;
}

.title-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-mark,
.archive-code {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 12px;
}

.section-mark {
  color: var(--accent);
  background: rgba(107, 74, 46, 0.08);
}

.archive-code {
  color: var(--ink);
  background: rgba(107, 74, 46, 0.1);
}

.movie-title {
  margin: 14px 0 0;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.metric-box {
  padding: 14px;
  background: rgba(255, 253, 248, 0.8);
  border: 1px solid rgba(58, 49, 38, 0.08);
  border-radius: 14px;
}

.metric-label {
  display: block;
  color: var(--ink-soft);
  font-size: 12px;
}

.metric-value {
  display: block;
  margin-top: 8px;
  font-size: 16px;
}

.detail-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.detail-box {
  display: grid;
  gap: 10px;
}

.detail-label {
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.token-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.token {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 11px;
  color: var(--accent);
  background: rgba(107, 74, 46, 0.08);
  border-radius: 999px;
  font-size: 12px;
}

.token-accent {
  color: #4f3421;
  background: rgba(217, 199, 167, 0.45);
}

.token-muted {
  color: var(--ink-soft);
  background: rgba(58, 49, 38, 0.08);
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.similar-entry {
  padding: 0;
  text-align: left;
  background: rgba(255, 252, 247, 0.95);
  border: 1px solid rgba(58, 49, 38, 0.08);
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
}

.similar-entry:hover {
  border-color: rgba(58, 49, 38, 0.2);
}

.similar-cover {
  min-height: 190px;
  background: rgba(107, 74, 46, 0.05);
}

.similar-image,
.similar-fallback {
  width: 100%;
  height: 190px;
}

.similar-image {
  display: block;
  object-fit: cover;
}

.similar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  color: var(--ink-soft);
  text-align: center;
  font-size: 12px;
}

.similar-copy {
  display: grid;
  gap: 6px;
  padding: 12px;
}

.similar-id {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.similar-title {
  color: var(--ink);
  font-size: 13px;
  line-height: 1.5;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.sort-select {
  width: 168px;
}

.magnet-table {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.magnet-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px 120px;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 253, 248, 0.76);
  border: 1px solid rgba(58, 49, 38, 0.08);
  border-radius: 14px;
}

.flag-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.flag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.flag-hd {
  color: #fff;
  background: #5c4630;
}

.flag-sub {
  color: #4f3421;
  background: rgba(217, 199, 167, 0.62);
}

.magnet-name {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.magnet-col-meta {
  display: grid;
  gap: 6px;
  color: var(--ink-soft);
  font-size: 12px;
}

.magnet-col-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1080px) {
  .catalog-header,
  .search-deck,
  .archive-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .catalog-shell {
    padding: 18px 16px 32px;
  }

  .search-form,
  .metric-grid,
  .magnet-row {
    grid-template-columns: 1fr;
  }

  .magnet-col-actions {
    justify-content: flex-start;
  }
}
</style>
