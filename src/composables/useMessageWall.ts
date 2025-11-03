/**
 * 留言墙Composable
 * 封装留言墙的核心逻辑，提供可复用的状态管理和方法
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { messageWallApi } from '@/api/messageWallApi'
import { handleApiError } from '@/utils/errorHandler'
import { createLogger } from '@/utils/logger'
import { MESSAGE_WALL } from '@/constants'
import type {
  MessageWallMessage,
  MessageWallQueryRequest,
  AddMessageRequest
} from '@/types/messageWall'

const logger = createLogger('useMessageWall')

/**
 * Composable配置选项
 */
export interface UseMessageWallOptions {
  /** 景点ID */
  scenicSpotId?: number
  /** 是否自动加载 */
  autoLoad?: boolean
  /** 是否自动刷新 */
  autoRefresh?: boolean
  /** 刷新间隔(毫秒) */
  refreshInterval?: number
  /** 是否只显示弹幕留言 */
  barrageOnly?: boolean
  /** 每页大小 */
  pageSize?: number
}

/**
 * 留言墙Composable
 * @param options 配置选项
 */
export function useMessageWall(options: UseMessageWallOptions = {}) {
  const {
    scenicSpotId: initialScenicSpotId,
    autoLoad = true,
    autoRefresh = false,
    refreshInterval = MESSAGE_WALL.REFRESH_INTERVAL,
    barrageOnly = false,
    pageSize = MESSAGE_WALL.PAGE_SIZE
  } = options

  // 状态
  const scenicSpotId = ref(initialScenicSpotId)
  const messages = ref<MessageWallMessage[]>([])
  const loading = ref(false)
  const sending = ref(false)
  const page = ref(1)
  const total = ref(0)
  
  // 定时器引用
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  /**
   * 加载留言列表
   */
  const loadMessages = async (params?: Partial<MessageWallQueryRequest>) => {
    if (!scenicSpotId.value) {
      logger.warn('景点ID未设置，无法加载留言')
      return
    }

    loading.value = true
    try {
      logger.debug('开始加载留言列表', { scenicSpotId: scenicSpotId.value })

      const queryParams: MessageWallQueryRequest = {
        scenicSpotId: scenicSpotId.value,
        status: MESSAGE_WALL.STATUS.APPROVED,
        pageSize: pageSize,
        current: page.value,
        ...params
      }

      // 如果只显示弹幕
      if (barrageOnly) {
        queryParams.isBarrage = true
      }

      const res = await messageWallApi.listMessages(queryParams)

      if (res.data.code === 0 && res.data.data) {
        messages.value = res.data.data.records || []
        total.value = res.data.data.total || 0
        logger.info('留言列表加载成功', {
          count: messages.value.length,
          total: total.value
        })
      } else {
        throw new Error(res.data.message || '获取留言列表失败')
      }
    } catch (error) {
      logger.error('加载留言失败', error)
      handleApiError(error, {
        customMessage: '加载留言失败',
        showMessage: (error as any)?.response?.status !== 401
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送留言
   */
  const sendMessage = async (content: string, options?: Partial<AddMessageRequest>) => {
    if (!scenicSpotId.value) {
      message.error('请先选择景点')
      return false
    }

    if (!content || !content.trim()) {
      message.warning('请输入留言内容')
      return false
    }

    if (content.length > MESSAGE_WALL.MAX_MESSAGE_LENGTH) {
      message.warning(`留言内容不能超过${MESSAGE_WALL.MAX_MESSAGE_LENGTH}字`)
      return false
    }

    sending.value = true
    try {
      logger.debug('发送留言', { scenicSpotId: scenicSpotId.value, contentLength: content.length })

      const payload: AddMessageRequest = {
        scenicSpotId: scenicSpotId.value,
        content: content.trim(),
        isBarrage: barrageOnly,
        ...options
      }

      const res = await messageWallApi.addMessage(payload)

      if (res.data.code === 0 || res.data.code === 200) {
        message.success('留言发送成功，等待审核通过后显示')
        logger.info('留言发送成功')
        
        // 刷新留言列表
        await loadMessages()
        return true
      } else {
        throw new Error(res.data.message || '发送留言失败')
      }
    } catch (error) {
      logger.error('发送留言失败', error)
      handleApiError(error, { customMessage: '发送留言失败' })
      return false
    } finally {
      sending.value = false
    }
  }

  /**
   * 点赞留言
   */
  const likeMessage = async (messageId: number) => {
    try {
      logger.debug('点赞留言', { messageId })
      const res = await messageWallApi.likeMessage(messageId)
      
      if (res.data.code === 0) {
        logger.info('点赞成功')
        // 更新本地状态
        const msg = messages.value.find(m => m.id === messageId)
        if (msg) {
          msg.isLiked = true
          msg.likeCount = (msg.likeCount || 0) + 1
        }
        return true
      }
      return false
    } catch (error) {
      logger.error('点赞失败', error)
      handleApiError(error, { customMessage: '点赞失败' })
      return false
    }
  }

  /**
   * 取消点赞
   */
  const unlikeMessage = async (messageId: number) => {
    try {
      logger.debug('取消点赞', { messageId })
      const res = await messageWallApi.cancelLikeMessage(messageId)
      
      if (res.data.code === 0) {
        logger.info('取消点赞成功')
        // 更新本地状态
        const msg = messages.value.find(m => m.id === messageId)
        if (msg) {
          msg.isLiked = false
          msg.likeCount = Math.max((msg.likeCount || 0) - 1, 0)
        }
        return true
      }
      return false
    } catch (error) {
      logger.error('取消点赞失败', error)
      handleApiError(error, { customMessage: '取消点赞失败' })
      return false
    }
  }

  /**
   * 删除留言
   */
  const deleteMessage = async (messageId: number) => {
    try {
      logger.debug('删除留言', { messageId })
      const res = await messageWallApi.deleteMessage(messageId)
      
      if (res.data.code === 0) {
        message.success('删除成功')
        logger.info('删除留言成功')
        // 从列表中移除
        messages.value = messages.value.filter(m => m.id !== messageId)
        total.value = Math.max(total.value - 1, 0)
        return true
      }
      return false
    } catch (error) {
      logger.error('删除留言失败', error)
      handleApiError(error, { customMessage: '删除失败' })
      return false
    }
  }

  /**
   * 刷新留言
   */
  const refreshMessages = async () => {
    page.value = 1
    await loadMessages()
  }

  /**
   * 切换页码
   */
  const changePage = async (newPage: number) => {
    page.value = newPage
    await loadMessages()
  }

  /**
   * 更新景点ID
   */
  const updateScenicSpotId = (newId: number) => {
    if (scenicSpotId.value !== newId) {
      scenicSpotId.value = newId
      page.value = 1
      messages.value = []
      loadMessages()
    }
  }

  /**
   * 启动自动刷新
   */
  const startAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    refreshTimer = setInterval(() => {
      logger.debug('自动刷新留言列表')
      loadMessages()
    }, refreshInterval)
    
    logger.debug('启动自动刷新', { interval: refreshInterval })
  }

  /**
   * 停止自动刷新
   */
  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
      logger.debug('停止自动刷新')
    }
  }

  // 计算属性
  const hasMessages = computed(() => messages.value.length > 0)
  const isEmpty = computed(() => !loading.value && messages.value.length === 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize))

  // 生命周期
  onMounted(() => {
    if (autoLoad && scenicSpotId.value) {
      loadMessages()
    }

    if (autoRefresh && scenicSpotId.value) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  // 返回状态和方法
  return {
    // 状态
    scenicSpotId,
    messages,
    loading,
    sending,
    page,
    total,
    hasMessages,
    isEmpty,
    totalPages,
    
    // 方法
    loadMessages,
    sendMessage,
    likeMessage,
    unlikeMessage,
    deleteMessage,
    refreshMessages,
    changePage,
    updateScenicSpotId,
    startAutoRefresh,
    stopAutoRefresh
  }
}

// 导出类型
export type UseMessageWallReturn = ReturnType<typeof useMessageWall>

