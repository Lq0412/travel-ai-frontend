<template>
  <div class="chat-window">
    <div class="messages" ref="listRef">
      <div v-if="!messages.length && !isLoading" class="empty-hint">
        你好，我是你的旅行助手。问我任何与旅行相关的问题吧～
      </div>
      <ChatMessage
        v-for="(item, idx) in messages"
        :key="idx"
        :message="item.text"
        :isUser="item.role === 'user'"
        :timestamp="item.time"
      />
      <div ref="endRef" style="height:1px; width:1px; overflow:hidden; visibility:hidden;" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatStream } from '@/composables/useChatStream'
import { useAutoScroll } from '@/composables/useAutoScroll'
import { getConversationMessages } from '@/api/conversationController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// no props for now
const emit = defineEmits<{
  (e: 'update:loading', value: boolean): void
}>()

const { messages, isLoading, startStream, closeStream } = useChatStream()
const listRef = ref<HTMLElement | null>(null)
const endRef = ref<HTMLElement | null>(null)
const { scrollToBottom } = useAutoScroll(listRef, endRef, { getLength: () => messages.value.length })
const loginUserStore = useLoginUserStore()

// 暴露控制函数给父组件
async function start(task: string, conversationId?: string, onConversationCreated?: (conversationId: string) => void) {
  // 将回调传递给 startStream，以便在创建新对话时通知父组件
  await startStream(task, conversationId, (smooth?: boolean) => scrollToBottom(!!smooth), onConversationCreated)
}
function close() {
  closeStream()
}
function addUserMessage(text: string) {
  if (!text?.trim()) return
  messages.value.push({ role: 'user', text, time: new Date() })
  scrollToBottom(true)
}

// 加载会话历史消息
async function loadConversationHistory(conversationId: string) {
  try {
    console.log('📜 开始加载会话历史消息')
    console.log('conversationId (原始):', conversationId, '类型:', typeof conversationId)
    console.log('用户ID (原始):', loginUserStore.loginUser.id, '类型:', typeof loginUserStore.loginUser.id)
    
    const userId = loginUserStore.loginUser.id
    if (!userId) {
      console.error('❌ 用户未登录，无法加载历史消息')
      return
    }

    // 重要：保持 conversationId 和 userId 为字符串格式，避免 JavaScript 数字精度丢失
    // Spring Boot 的 PathVariable 和 RequestParam 会自动将字符串转换为 Long
    // 对于大整数（雪花算法生成的 ID），必须保持字符串格式传递
    const conversationIdStr = String(conversationId)
    const userIdStr = String(userId)
    
    console.log('conversationId (字符串):', conversationIdStr)
    console.log('userId (字符串):', userIdStr)
    
    // 验证字符串不为空
    if (!conversationIdStr || conversationIdStr === 'undefined' || conversationIdStr === 'null') {
      console.error('❌ conversationId 无效:', conversationIdStr)
      return
    }
    if (!userIdStr || userIdStr === 'undefined' || userIdStr === 'null') {
      console.error('❌ userId 无效:', userIdStr)
      return
    }

    // 注意：虽然类型定义是 number，但我们需要传递字符串以避免大整数精度丢失
    // Spring Boot 会自动将 URL 路径和查询参数中的字符串转换为 Long
    const response = await getConversationMessages({
      conversationId: conversationIdStr as any, // 保持为字符串，避免精度丢失
      userId: userIdStr as any // 保持为字符串，避免精度丢失
    } as any)

    console.log('📥 历史消息响应:', response.data)
    console.log('响应码:', response.data.code)
    console.log('响应数据:', response.data.data)
    console.log('响应消息:', response.data.message)

    if ((response.data.code === 0 || response.data.code === 200) && response.data.data) {
      // 清空当前消息
      messages.value = []

      // 加载历史消息
      const messageList = Array.isArray(response.data.data) ? response.data.data : []
      console.log('📝 准备加载', messageList.length, '条历史消息')
      
      messageList.forEach((msg: any) => {
        messages.value.push({
          role: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content || '',
          time: new Date(msg.createTime || Date.now())
        })
      })

      // 滚动到底部
      scrollToBottom(true)
      console.log('✅ 加载历史消息成功，共', messages.value.length, '条消息')
      console.log('消息列表:', messages.value)
    } else {
      console.error('❌ 加载历史消息失败，响应码:', response.data.code, '错误信息:', response.data.message)
      // 即使失败也显示提示
      messages.value = []
    }
  } catch (error: any) {
    console.error('❌ 加载历史消息时发生错误:', error)
    console.error('错误详情:', error.response?.data || error.message)
    // 错误时也清空消息，避免显示错误状态
    messages.value = []
  }
}

// 清空消息
function clearMessages() {
  messages.value = []
}

defineExpose({ start, close, addUserMessage, loadConversationHistory, clearMessages, messages, isLoading })

// 同步内部加载态到父组件，保证输入不被错误禁用
watch(isLoading, (v) => emit('update:loading', !!v), { immediate: true })
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 16px 16px 140px;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}
.empty-hint {
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: #888;
  font-size: 18px;
}
</style>
