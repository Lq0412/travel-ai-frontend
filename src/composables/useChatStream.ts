import { ref, onBeforeUnmount } from 'vue'
import type { ChatItem } from '@/types/chat'
import { createConversation } from '@/api/conversationController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

export function useChatStream() {
  const messages = ref<ChatItem[]>([])
  const isLoading = ref(false)
  const eventSource = ref<EventSource | null>(null)
  const abortController = ref<AbortController | null>(null)

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

  /**
   * 过滤AI响应，只保留"观察:"后面的内容（给用户看的部分）
   * 隐藏"思考:"和"行动:"部分（内部推理过程）
   * 
   * @param fullText 完整的AI响应文本
   * @returns 过滤后的文本
   */
  const filterAIResponse = (fullText: string): string => {
    if (!fullText) return ''
    
    // 匹配"观察:"或"观察："后面的所有内容
    const observationMatch = fullText.match(/观察[:：]\s*(.+)/s)
    if (observationMatch) {
      let filtered = observationMatch[1].trim()
      // 移除可能的emoji前缀
      filtered = filtered.replace(/^🏞️\s*/g, '')
      return filtered
    }
    
    // 如果没有找到"观察:"标签，检查是否包含"思考:"或"行动:"
    // 如果包含，说明还在推理阶段，返回空（不显示）
    if (fullText.includes('思考:') || fullText.includes('思考：') || 
        fullText.includes('行动:') || fullText.includes('行动：')) {
      return ''
    }
    
    // 既没有标签，也不是推理过程，返回原文本
    return fullText
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
    
    // 用于累积完整AI响应的缓冲区
    let fullResponseBuffer = ''
    // 记录"观察:"在缓冲区中的起始位置（-1表示还没找到）
    let observationStartIndex = -1

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
        
        if ((response.data.code === 0 || response.data.code === 200) && response.data.data) {
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

    // 使用 fetch + ReadableStream 替代 EventSource，以支持發送憑證
    abortController.value = new AbortController()
    
    fetch(url.toString(), {
      method: 'GET',
      credentials: 'include', // 發送 cookies
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      },
      signal: abortController.value.signal
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        if (!response.body) {
          throw new Error('Response body is null')
        }
        
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        
        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) {
                isLoading.value = false
                break
              }
              
              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() || ''
              
              for (const line of lines) {
                if (!line.trim()) continue
                
                // 解析 SSE 格式：event: xxx 或 data: xxx
                if (line.startsWith('event:')) {
                  const eventType = line.substring(6).trim()
                  if (eventType === 'complete' || eventType === 'end' || eventType === 'done') {
                    isLoading.value = false
                    return
                  }
                } else if (line.startsWith('data:')) {
                  const data = line.substring(5).trim()
                  const text = parsePayload(data)
                  
                  if (text === '[DONE]' || text === '流式响应完成') {
                    isLoading.value = false
                    return
                  }
                  
                  if (text) {
                    // 累积完整响应
                    fullResponseBuffer += text
                    
                    // 如果还没找到"观察:"标签，尝试查找
                    if (observationStartIndex === -1) {
                      const index1 = fullResponseBuffer.indexOf('观察:')
                      const index2 = fullResponseBuffer.indexOf('观察：')
                      
                      if (index1 !== -1) {
                        observationStartIndex = index1 + 3 // "观察:" 长度为3
                      } else if (index2 !== -1) {
                        observationStartIndex = index2 + 3 // "观察：" 长度为3
                      }
                      
                      // 找到"观察:"后，提取后面的内容并开始显示
                      if (observationStartIndex !== -1) {
                        // 跳过"观察:"后面可能的空格和emoji
                        let content = fullResponseBuffer.substring(observationStartIndex)
                        content = content.replace(/^\s*🏞️\s*/, '').trimStart()
                        
                        // 更新观察内容的真实起始位置
                        observationStartIndex = fullResponseBuffer.length - content.length
                        
                        // 显示初始内容
                        messages.value[index].text = content
                        onScroll(false)
                      }
                    } else {
                      // 已经找到"观察:"，直接追加新到达的文本块
                      // text 就是本次新到达的数据，直接追加即可
                      messages.value[index].text += text
                      onScroll(false)
                    }
                  }
                }
              }
            }
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.error('Stream processing error:', error)
              isLoading.value = false
            }
          }
        }
        
        processStream()
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error)
          messages.value[index].text += '\n\n❌ 連接失敗，請檢查網絡或重新登錄'
        }
        isLoading.value = false
      })
  }

  const closeStream = () => {
    try { 
      eventSource.value?.close()
      abortController.value?.abort()
    } catch {}
    eventSource.value = null
    abortController.value = null
    isLoading.value = false
  }

  onBeforeUnmount(() => closeStream())

  return { messages, isLoading, startStream, closeStream }
}



