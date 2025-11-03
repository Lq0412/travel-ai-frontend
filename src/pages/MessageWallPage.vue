<template>
  <div class="message-wall-page">
    <div class="page-header">
      <h1>景点留言墙</h1>
      <p class="subtitle">选择一个景点，查看和发送留言</p>
    </div>

    <div class="scenic-spots-container">
      <a-spin :spinning="loading" tip="加载景点中...">
        <div v-if="scenicSpots.length === 0 && !loading" class="empty-state">
          <a-empty description="暂无景点数据" />
        </div>
        <div v-else class="scenic-spots-grid">
          <a-card
            v-for="spot in scenicSpots"
            :key="spot.id"
            class="scenic-card"
            :hoverable="true"
            @click="goToDisplay(spot.id)"
          >
            <template #cover>
              <div class="card-cover">
                <img
                  v-if="spot.coverUrl"
                  :src="spot.coverUrl"
                  :alt="spot.name"
                  class="cover-image"
                />
                <div v-else class="cover-placeholder">
                  <span>暂无图片</span>
                </div>
              </div>
            </template>
            <a-card-meta>
              <template #title>
                <h3 class="spot-name">{{ spot.name }}</h3>
              </template>
              <template #description>
                <p class="spot-intro" :title="spot.introduction">
                  {{ getShortIntro(spot.introduction) }}
                </p>
                <p v-if="spot.location" class="spot-location">
                  <EnvironmentOutlined />
                  {{ spot.location }}
                </p>
              </template>
            </a-card-meta>
            <div class="card-footer">
              <a-button type="primary" block @click.stop="goToDisplay(spot.id)">
                查看留言墙
              </a-button>
            </div>
          </a-card>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EnvironmentOutlined } from '@ant-design/icons-vue'
import { listSpots } from '@/api/scenicController'

const router = useRouter()

const loading = ref(false)
const scenicSpots = ref<API.ScenicSpot[]>([])

// 获取景点列表
const loadScenicSpots = async () => {
  loading.value = true
  try {
    const res = await listSpots()
    if (res.data.code === 0 && res.data.data) {
      // 过滤已删除的景点
      scenicSpots.value = res.data.data.filter((spot: API.ScenicSpot) => spot.id)
      console.log('[留言墙] 加载景点列表:', scenicSpots.value.length)
    } else {
      message.error(res.data.message || '获取景点列表失败')
      scenicSpots.value = []
    }
  } catch (error: any) {
    console.error('[留言墙] 加载景点列表失败:', error)
    message.error('获取景点列表失败，请稍后重试')
    scenicSpots.value = []
  } finally {
    loading.value = false
  }
}

// 跳转到留言墙展示页
const goToDisplay = (scenicSpotId: number) => {
  if (!scenicSpotId) {
    message.warning('景点ID无效')
    return
  }
  router.push({
    path: `/message-wall/${scenicSpotId}`
  })
}

// 获取简介的简短版本
const getShortIntro = (intro?: string): string => {
  if (!intro) return '暂无简介'
  if (intro.length <= 50) return intro
  return intro.substring(0, 50) + '...'
}

onMounted(() => {
  loadScenicSpots()
})
</script>

<style scoped>
.message-wall-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.scenic-spots-container {
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.scenic-spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 16px 0;
}

.scenic-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scenic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.scenic-card:hover .cover-image {
  transform: scale(1.05);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #9ca3af;
  font-size: 14px;
}

.spot-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.spot-intro {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-location {
  color: #9ca3af;
  font-size: 13px;
  margin: 8px 0 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-footer {
  margin-top: auto;
  padding-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scenic-spots-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .message-wall-page {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .scenic-spots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .scenic-spots-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

