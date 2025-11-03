import { ref, onBeforeUnmount } from 'vue'
import type { ChatItem } from '@/types/chat'
import { createConversation } from '@/api/conversationController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

export function useChatStream() {
  const messages = ref<ChatItem[]>([])
  const isLoading = ref(false)
  const eventSource = ref<EventSource | null>(null)

  // Immediate append rendering (simpler and robust for large chunks)
  const handleChunk = (chunk: string, index: number, getScroll: (smooth?: boolean) => void) => {
    if (!chunk) return
    messages.value[index].text += chunk
    getScroll(false)
  }

  const parsePayload = (raw: string): string => {
    const s = typeof raw === 'string' ? raw : String(raw ?? '')
    if (!s) return ''
    try {
      const obj = JSON.parse(s)
      if (obj?.content) return String(obj.content)
      if (obj?.delta?.content) return String(obj.delta.content)
      if (Array.isArray(obj?.choices) && obj.choices[0]?.delta?.content) return String(obj.choices[0].delta.content)
      if (typeof obj?.data === 'string') return obj.data
      return s
    } catch {
      return s
    }
  }

  const startStream = async (
    task: string, 
    conversationId: string | undefined, 
    onScroll: (smooth?: boolean) => void,
    onConversationCreated?: (conversationId: string) => void
  ) => {
    try { eventSource.value?.close() } catch {}
    eventSource.value = null
    // reset state for new stream
    isLoading.value = true

    const index = messages.value.length
    messages.value.push({ role: 'ai', text: '', time: new Date() })

    // 如果没有对话ID，先创建新对话
    let finalConversationId = conversationId
    if (!finalConversationId) {
      try {
        const loginUserStore = useLoginUserStore()
        const userId = loginUserStore.loginUser.id
        if (!userId) {
          console.error('❌ 用户未登录，无法创建对话')
          return
        }
        
        // 保持 userId 为字符串格式，避免大整数精度丢失
        const userIdStr = String(userId)
        
        const response = await createConversation({
          userId: userIdStr as any, // 保持为字符串，避免精度丢失
          title: task.length > 20 ? task.substring(0, 20) + '...' : task,
          provider: 'dashscope',
          model: 'qwen-turbo'
        } as any)
        
        if (response.data.code === 200 && response.data.data) {
          // 确保返回的 ID 也转换为字符串格式
          finalConversationId = String(response.data.data.id)
          console.log('✅ 创建新对话成功，ID:', finalConversationId, '类型:', typeof finalConversationId)
          // 通知父组件新创建的对话ID
          if (onConversationCreated) {
            onConversationCreated(finalConversationId)
          }
        } else {
          console.error('❌ 创建对话失败:', response.data.message)
        }

      } catch (error) {
        console.error('创建对话时发生错误:', error)
      }
    } else {
      console.log('✅ 使用现有对话ID:', finalConversationId, '类型:', typeof finalConversationId)
    }

    const url = new URL('/api/ai/tourism/stream', window.location.origin)
    url.searchParams.set('task', task)
    if (finalConversationId) url.searchParams.set('conversationId', String(finalConversationId))

    const es = new EventSource(url.toString())
    eventSource.value = es

    const events = ['message', 'start', 'data', 'result', 'complete', 'end', 'done', 'error']
    const onEvent = (e: MessageEvent) => {
      const text = parsePayload(e.data as string)
      // 后端自定义完成语义：complete 事件；兼容历史标记
      if (
        (e.type === 'complete') ||
        text === '[DONE]' ||
        text === '流式响应完成'
      ) {
        try { es.close() } catch {}
        eventSource.value = null
        isLoading.value = false
        return
      }
      // result 事件：最终汇总，作为普通片段追加
      // data/start/message：普通增量片段
      handleChunk(text, index, onScroll)
    }
    events.forEach(ev => es.addEventListener(ev, onEvent as EventListener))

    es.onerror = () => {
      try { es.close() } catch {}
      eventSource.value = null
      isLoading.value = false
    }
  }

  const closeStream = () => {
    try { eventSource.value?.close() } catch {}
    eventSource.value = null
    isLoading.value = false
  }

  onBeforeUnmount(() => closeStream())

  return { messages, isLoading, startStream, closeStream }
}



