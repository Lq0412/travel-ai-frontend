<template>
  <div class="message-wall-page">
    <div class="header">
      <h2>景点留言墙</h2>
      <!-- 如果景点ID未设置，显示景点选择器 -->
      <div v-if="!scenicSpotId" class="spot-selector">
        <a-select
          v-model:value="selectedScenicSpotId"
          placeholder="请选择景点"
          style="width: 300px"
          :loading="loadingSpots"
          @change="onSpotChange"
        >
          <a-select-option v-for="spot in scenicSpots" :key="spot.id" :value="spot.id">
            {{ spot.name }}
          </a-select-option>
        </a-select>
      </div>
      <div v-else class="spot-info">
        <span>景点: {{ currentSpotName || `ID: ${scenicSpotId}` }}</span>
        <a-button type="link" size="small" @click="resetSpot">切换景点</a-button>
      </div>
    </div>

    <div 
      class="message-wall-container" 
      ref="container"
      :style="getContainerStyle()"
    >
      <a-spin :spinning="loading" tip="加载留言中...">
        <template v-if="scenicSpotId">
          <div
            v-for="(item, idx) in messages"
            :key="item.id || idx"
            class="message-item"
            :style="getMessageStyle(item, idx)"
          >
            {{ item.content }}
          </div>
          <div v-if="messages.length === 0 && !loading" class="empty">当前暂无留言</div>
        </template>
        <div v-else class="empty">
          <a-empty description="请先选择景点" />
        </div>
      </a-spin>
    </div>

    <div class="send-box">
      <div class="send-wrapper">
        <a-textarea
          v-model:value="content"
          :rows="3"
          placeholder="输入留言内容（最多200字）"
          :maxlength="200"
          :disabled="sending || loading || !scenicSpotId"
          show-count
          class="textarea-input"
        />
        <a-button
          type="primary"
          @click="sendMessage"
          :loading="sending"
          :disabled="!scenicSpotId"
          class="send-button"
          size="large"
        >
          发送留言
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listSpots } from '@/api/scenicController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { messageWallApi } from '@/api/messageWallApi'
import { handleApiError } from '@/utils/errorHandler'
import { createComponentLogger } from '@/utils/logger'
import { MESSAGE_WALL, STORAGE_KEYS, DEFAULT_IMAGES, ROUTES } from '@/constants'

// 创建组件专用logger
const logger = createComponentLogger('MessageWallDisplay')

const route = useRoute()
const router = useRouter()
const loginUserStore = useLoginUserStore()

// 景点ID的多种获取方式（优先级：路由参数 > 查询参数 > localStorage > 默认景点）
const getScenicSpotId = (): number => {
  const paramId = route.params.scenicSpotId
  const queryId = route.query.scenicSpotId
  const storedId = localStorage.getItem(STORAGE_KEYS.SCENIC_SPOT_ID)

  if (paramId && !isNaN(Number(paramId))) {
    return Number(paramId)
  }
  if (queryId && !isNaN(Number(queryId))) {
    return Number(queryId)
  }
  if (storedId && !isNaN(Number(storedId))) {
    return Number(storedId)
  }
  return MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID
}

const scenicSpotId = ref<number>(getScenicSpotId())
const selectedScenicSpotId = ref<number>()
const scenicSpots = ref<API.ScenicSpot[]>([])
const loadingSpots = ref(false)

// 加载景点列表
const loadScenicSpots = async () => {
  loadingSpots.value = true
  try {
    logger.debug('开始加载景点列表')
    const res = await listSpots()
    if (res.data.code === 0 && res.data.data) {
      scenicSpots.value = res.data.data.filter((spot: API.ScenicSpot) => spot.id)
      logger.info('景点列表加载成功', { count: scenicSpots.value.length })
    } else {
      throw new Error(res.data.message || '获取景点列表失败')
    }
  } catch (error) {
    logger.error('加载景点列表失败', error)
    handleApiError(error, { customMessage: '获取景点列表失败' })
  } finally {
    loadingSpots.value = false
  }
}

const intervalTimer = ref<ReturnType<typeof window.setInterval> | null>(null)

// 监听路由参数变化
watch(() => route.params.scenicSpotId, (newId) => {
  if (newId && !isNaN(Number(newId))) {
    scenicSpotId.value = Number(newId)
    localStorage.setItem(STORAGE_KEYS.SCENIC_SPOT_ID, String(scenicSpotId.value))
    load()
  }
})

// 景点选择变化
const onSpotChange = (spotId: number) => {
  if (!spotId) return
  scenicSpotId.value = spotId
  localStorage.setItem(STORAGE_KEYS.SCENIC_SPOT_ID, String(spotId))
  
  // 更新URL
  router.push({
    path: ROUTES.MESSAGE_WALL_DETAIL(spotId),
    replace: true
  })
}

// 重置景点选择
const resetSpot = () => {
  scenicSpotId.value = MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID
  localStorage.removeItem(STORAGE_KEYS.SCENIC_SPOT_ID)
  selectedScenicSpotId.value = undefined
  router.push(ROUTES.MESSAGE_WALL)
}

// 当前景点名称
const currentSpotName = computed(() => {
  const spot = scenicSpots.value.find(s => s.id && s.id === scenicSpotId.value)
  return spot ? spot.name : ''
})

// 获取当前景点的背景图片URL
const getCurrentSpotBackgroundUrl = (): string => {
  if (!scenicSpotId.value || scenicSpots.value.length === 0) {
    return DEFAULT_IMAGES.BACKGROUND
  }
  const spot = scenicSpots.value.find(s => s.id && s.id === scenicSpotId.value)
  // 优先使用景点的封面图作为背景，如果没有则使用默认背景
  if (spot && spot.coverUrl) {
    return spot.coverUrl
  }
  return DEFAULT_IMAGES.BACKGROUND
}

// 获取容器样式
const getContainerStyle = () => {
  const backgroundUrl = getCurrentSpotBackgroundUrl()
  return {
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.45) 100%), url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

const messages = ref<API.MessageWallVO[]>([])
const content = ref<string>('')
const sending = ref(false)
const loading = ref(false)

const container = ref<HTMLElement | null>(null)

// 加载留言
const load = async () => {
  if (!scenicSpotId.value) {
    return
  }
  loading.value = true
  try {
    logger.debug('开始加载留言列表', { scenicSpotId: scenicSpotId.value })
    
    // 调用留言墙接口，查询isBarrage=true的留言（动画展示效果）
    const res = await messageWallApi.listMessages({
      scenicSpotId: scenicSpotId.value,
      isBarrage: true,
      status: MESSAGE_WALL.STATUS.APPROVED,
      pageSize: MESSAGE_WALL.PAGE_SIZE,
      current: 1
    })
    
    // 处理响应数据
    if (res.data.code === 0 && res.data.data) {
      messages.value = res.data.data.records || []
      logger.info('留言列表加载成功', { count: messages.value.length })
    } else {
      throw new Error(res.data.message || '获取留言列表失败')
    }
  } catch (error) {
    logger.error('加载留言失败', error)
    // 不显示401错误（可能是未登录状态），其他错误才显示
    handleApiError(error, {
      customMessage: '加载留言失败',
      showMessage: (error as any)?.response?.status !== 401
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 始终尝试获取登录状态，确保状态同步
  await loginUserStore.fetchLoginUser()
  logger.debug('登录状态', { 
    isLoggedIn: !!loginUserStore.loginUser.id,
    userId: loginUserStore.loginUser.id 
  })
  
  // 先加载景点列表
  loadScenicSpots().then(() => {
    // 如果有景点ID，加载留言
    if (scenicSpotId.value) {
      load()
      // 轮询刷新留言
      intervalTimer.value = window.setInterval(load, MESSAGE_WALL.REFRESH_INTERVAL)
      logger.debug('启动定时刷新', { interval: MESSAGE_WALL.REFRESH_INTERVAL })
    }
  })
})

onUnmounted(() => {
  // 清理定时器
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value)
    intervalTimer.value = null
  }
})

const sendMessage = async () => {
  const contentValue = content.value.trim()

  logger.debug('发送留言', { 
    contentLength: contentValue.length, 
    scenicSpotId: scenicSpotId.value 
  })

  // 检查登录状态 - 先尝试刷新用户信息
  if (!loginUserStore.loginUser.id) {
    logger.debug('用户未登录，尝试刷新用户信息')
    await loginUserStore.fetchLoginUser()
  }
  
  // 检查用户是否已登录
  if (!loginUserStore.loginUser.id) {
    logger.warn('用户未登录，跳转到登录页')
    message.warning('请先登录后再发送留言')
    router.push({
      path: ROUTES.USER_LOGIN,
      query: { redirect: route.fullPath }
    })
    return
  }
  
  logger.debug('用户已登录', { userId: loginUserStore.loginUser.id })

  // 输入验证
  if (!contentValue) {
    message.warning('请输入留言内容')
    return
  }

  if (contentValue.length > MESSAGE_WALL.MAX_MESSAGE_LENGTH) {
    message.warning(`留言内容不能超过${MESSAGE_WALL.MAX_MESSAGE_LENGTH}字`)
    return
  }

  if (!scenicSpotId.value) {
    message.error('请先选择景点')
    return
  }

  sending.value = true
  try {
    const payload = { 
      scenicSpotId: scenicSpotId.value, 
      content: contentValue,
      isBarrage: true  // 标记为动画展示效果
    }
    
    logger.debug('发送留言请求', payload)
    const res = await messageWallApi.addMessage(payload)
    logger.debug('留言发送响应', { code: res.data.code })
    
    // 处理响应数据
    if (res.data.code === 0 || res.data.code === 200) {
      message.success('留言发送成功，等待审核通过后显示')
      logger.info('留言发送成功')
      // 成功后刷新（新留言需要审核，可能不会立即显示）
      content.value = ''
      await load()
    } else if (res.data.code === 401 || res.data.message?.includes('请先登录')) {
      // 业务逻辑返回 401，说明认证失败
      throw new Error(res.data.message || '请先登录')
    } else {
      throw new Error(res.data.message || '发送留言失败')
    }
  } catch (error: any) {
    logger.error('发送留言失败', error)
    
    const errorMsg = error?.response?.data?.message || error?.message || '未知错误'
    const statusCode = error?.response?.status
    
    // 如果是认证错误（401/403状态码），提示登录并跳转
    if (statusCode === 401 || statusCode === 403) {
      message.warning('请先登录后再发送留言')
      router.push({
        path: ROUTES.USER_LOGIN,
        query: { redirect: route.fullPath }
      })
    } else if (errorMsg.includes('请先登录') || error?.response?.data?.code === 401) {
      // 如果错误消息是"请先登录"或业务逻辑返回401，可能是认证问题
      logger.warn('后端返回认证错误，尝试刷新登录状态')
      
      // 先尝试刷新登录状态
      await loginUserStore.fetchLoginUser()
      
      if (!loginUserStore.loginUser.id) {
        // 如果刷新后还是没有登录信息，说明真的未登录
        message.warning('登录状态已过期，请重新登录')
        router.push({
          path: ROUTES.USER_LOGIN,
          query: { redirect: route.fullPath }
        })
      } else {
        // 如果刷新后还有登录信息，但请求还是失败，说明是后端认证拦截器问题
        logger.error('用户已登录但后端认证失败', {
          userId: loginUserStore.loginUser.id,
          apiStatus: statusCode
        })
        message.error({
          content: '发送留言失败：后端认证问题。请尝试重新登录或联系管理员。',
          duration: 5
        })
      }
    } else {
      handleApiError(error, {
        customMessage: '发送留言失败'
      })
    }
  } finally {
    sending.value = false
  }
}

const getMessageStyle = (item: API.MessageWallVO, idx: number) => {
  // 改进布局算法，避免重叠
  const rowHeight = MESSAGE_WALL.BARRAGE.ROW_HEIGHT
  const totalRows = Math.ceil((container.value?.clientHeight || 400) / rowHeight)
  const row = idx % totalRows
  const top = row * rowHeight + 10

  // 随机延迟启动，避免所有留言同时开始
  const delay = (idx % 4) * 0.8

  // 使用后端返回的速度，如果没有则随机
  const speed = item.barrageSpeed
  const baseDuration = speed ? (speed / 100 * 10 + MESSAGE_WALL.BARRAGE.MIN_DURATION) : (MESSAGE_WALL.BARRAGE.MIN_DURATION + (idx % 8) * 1)
  const duration = Math.max(MESSAGE_WALL.BARRAGE.MIN_DURATION, Math.min(MESSAGE_WALL.BARRAGE.MAX_DURATION, baseDuration))

  // 支持自定义颜色和字体大小
  const color = item.textColor || MESSAGE_WALL.BARRAGE.DEFAULT_COLOR
  const fontSize = item.fontSize ? `${item.fontSize}px` : `${MESSAGE_WALL.BARRAGE.DEFAULT_FONT_SIZE}px`

  return {
    top: `${top}px`,
    animation: `moveLeft ${duration}s linear infinite`,
    animationDelay: `${delay}s`,
    color: color,
    fontSize: fontSize,
  }
}
</script>

<style scoped>
.message-wall-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.spot-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spot-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.message-wall-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: background-image 0.5s ease-in-out;
}

.message-item {
  position: absolute;
  white-space: nowrap;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  z-index: 10;
}

.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

@keyframes moveLeft {
  from {
    transform: translateX(100vw);
  }
  to {
    transform: translateX(-100%);
  }
}

.send-box {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
}

.send-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.textarea-input {
  flex: 1;
}

.send-button {
  min-width: 100px;
}
</style>

