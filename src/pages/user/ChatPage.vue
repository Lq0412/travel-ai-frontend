<template>
  <div class="helper-page">
    <!-- 侧边栏 -->
    <ChatSidebar
      v-if="showSidebar"
      :conversations="conversations"
      :activeId="currentConversationId"
      @close="showSidebar = false"
      @switch="handleSwitch"
      @delete="handleDelete"
      @new="handleNew"
      class="sidebar"
    />

    <!-- 聊天卡片 -->
    <div class="chat-main" :class="{ 'sidebar-open': showSidebar }">
      <div class="chat-content">
        <!-- 头部 -->
        <div class="chat-header">
        <button @click="showSidebar = !showSidebar" class="menu-btn glass-btn" aria-label="菜单">
          <img src="https://unpkg.com/lucide-static@latest/icons/menu.svg" alt="菜单" class="icon" />
        </button>
        
        <div class="header-title">
          <img src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg" alt="" class="title-icon" />
          <h2>AI 旅行助手</h2>
          <span class="status-badge" :class="{ active: !isLoading }">
            <span class="status-dot"></span>
            {{ isLoading ? '思考中' : '在线' }}
          </span>
        </div>

        <div class="header-actions">
          <button @click="handleNew" class="action-btn glass-btn" title="新对话">
            <img src="https://unpkg.com/lucide-static@latest/icons/plus-circle.svg" alt="新对话" class="icon" />
            <span class="btn-label">新对话</span>
          </button>
        </div>
      </div>

        <ChatWindow ref="windowRef" @update:loading="(v) => (isLoading = v)" />

        <ChatInput :disabled="isLoading" placeholder="随便问我什么..." @send-message="onSend" />
      </div>
      
      <!-- 数字人悬浮按钮 -->
      <transition name="scale-fade">
        <div v-if="!showDigitalHuman" class="digital-human-fab">
          <button 
            @click="toggleDigitalHuman" 
            class="fab-button"
            title="数字人助手"
          >
            <img src="https://unpkg.com/lucide-static@latest/icons/bot.svg" alt="数字人" class="icon" />
            <span class="fab-ripple"></span>
          </button>
        </div>
      </transition>
    </div>

    <!-- 数字人全屏面板 -->
    <transition name="modal-fade">
      <div v-if="showDigitalHuman" class="digital-human-overlay" @click.self="toggleDigitalHuman">
        <div class="digital-human-panel" @click.stop>
          <div class="digital-human-header">
            <div class="header-left">
              <img src="https://unpkg.com/lucide-static@latest/icons/bot.svg" alt="" class="header-icon" />
              <h3>数字人助手</h3>
            </div>
            <button @click="toggleDigitalHuman" class="close-btn" title="关闭">
              <img src="https://unpkg.com/lucide-static@latest/icons/x.svg" alt="关闭" class="icon" />
            </button>
          </div>
          <div class="digital-human-content">
            <DigitalHumanIframe
              src="http://127.0.0.1:8888/static/MiniLive_RealTime.html"
              @loaded="onDigitalHumanLoaded"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ChatSidebar from './ChatSidebar.vue'
import ChatWindow from './ChatWindow.vue'
import ChatInput from './ChatInput.vue'
import DigitalHumanIframe from '@/components/DigitalHumanIframe.vue'
import type { Conversation } from '@/types/chat'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { getUserConversations, deleteConversation } from '@/api/conversationController'

const showSidebar = ref(false)
const isLoading = ref(false)
const conversations = ref<Conversation[]>([])
const currentConversationId = ref<string | null>(null)
const windowRef = ref<InstanceType<typeof ChatWindow> | null>(null)
const loginUserStore = useLoginUserStore()
const showDigitalHuman = ref(false)
// 移除 digitalHumanKey，使用 URL 参数防止缓存即可，不需要强制重新创建组件

// 加载用户会话列表
async function loadConversations() {
  console.log('📞 开始调用 loadConversations 函数')
  try {
    console.log('检查用户登录状态...')
    console.log('loginUserStore.loginUser:', loginUserStore.loginUser)
    console.log('loginUserStore.loginUser.id:', loginUserStore.loginUser.id)

    if (!loginUserStore.loginUser.id) {
      console.warn('⚠️ 用户未登录，无法加载会话列表')
      return
    }

    console.log('✅ 用户已登录，开始加载会话列表，用户ID:', loginUserStore.loginUser.id)
    console.log('📡 调用 getUserConversations API...')

    const response = await getUserConversations({
      userId: loginUserStore.loginUser.id,
      pageNum: 1,
      pageSize: 50
    })

    console.log('📥 会话列表响应:', response.data)
    if ((response.data.code === 0 || response.data.code === 200) && response.data.data) {
      conversations.value = response.data.data.map((conv: any) => ({
        id: String(conv.id),
        title: conv.title || '新对话',
        updateTime: conv.updateTime
      }))
      console.log('✅ 加载会话列表成功，共', conversations.value.length, '个对话')
      console.log('会话列表数据:', conversations.value)
    } else {
      console.error('❌ 加载会话列表失败:', response.data.message)
    }
  } catch (error) {
    console.error('❌ 加载会话列表时发生错误:', error)
  }
}

// 组件挂载时加载会话列表
onMounted(() => {
  console.log('🚀 页面加载，开始获取会话列表...')
  console.log('用户登录状态:', loginUserStore.loginUser)
  console.log('用户ID:', loginUserStore.loginUser.id)
  loadConversations()
})

async function onSend(payload: string | { message: string }) {
  const message = typeof payload === 'string' ? payload : payload.message
  if (!message?.trim()) return
  // 先把用户消息渲染出来
  windowRef.value?.addUserMessage(message)
  // 然后启动流式，如果创建了新对话，更新 currentConversationId
  await windowRef.value?.start(
    message, 
    currentConversationId.value ?? undefined,
    (newConversationId: string) => {
      // 当创建新对话时，保存 conversationId 以便后续消息使用同一个会话
      console.log('🔄 收到新创建的对话ID，更新当前会话:', newConversationId)
      currentConversationId.value = newConversationId
      // 刷新会话列表以显示新对话
      loadConversations()
    }
  )
}

async function handleSwitch(id: string) {
  console.log('切换会话:', id)
  currentConversationId.value = id
  showSidebar.value = false

  // 加载选中会话的历史消息
  if (windowRef.value) {
    await windowRef.value.loadConversationHistory(id)
  }
}

async function handleDelete(id: string | number) {
  try {
    if (!loginUserStore.loginUser.id) {
      console.warn('用户未登录，无法删除会话')
      return
    }

    // 保持 conversationId 为字符串格式，避免大整数精度丢失
    const conversationIdStr = String(id)
    const userIdStr = String(loginUserStore.loginUser.id)

    console.log('删除会话:', conversationIdStr)
    console.log('用户ID:', userIdStr)
    console.log('传递的参数:', {
      conversationId: conversationIdStr,
      userId: userIdStr
    })

    const response = await deleteConversation({
      conversationId: conversationIdStr as any, // 保持为字符串，避免精度丢失
      userId: userIdStr as any // 保持为字符串，避免精度丢失
    } as any)

    console.log('删除会话响应:', response.data)

    if (response.data.code === 0 || response.data.code === 200) {
      // 删除成功，刷新会话列表
      await loadConversations()

      // 如果删除的是当前会话，清空当前会话
      if (String(id) === currentConversationId.value) {
        currentConversationId.value = null
        if (windowRef.value) {
          windowRef.value.clearMessages()
        }
      }

      console.log('✅ 删除会话成功')
    } else {
      console.error('❌ 删除会话失败:', response.data.message)
    }
  } catch (error) {
    console.error('❌ 删除会话时发生错误:', error)
  }
}

async function handleNew() {
  console.log('创建新对话')
  currentConversationId.value = null
  if (windowRef.value) {
    windowRef.value.clearMessages()
  }
}

// 切换数字人显示
function toggleDigitalHuman() {
  showDigitalHuman.value = !showDigitalHuman.value
  // 不再强制重新创建组件，保持角色切换状态
  // 缓存问题由 DigitalHumanIframe 组件内部的 URL 参数解决
  console.log('数字人面板状态:', showDigitalHuman.value ? '显示' : '隐藏')
}

// 数字人加载完成
function onDigitalHumanLoaded() {
  console.log('数字人加载完成')
}
</script>


<style scoped>
/* 页面容器 */
.helper-page {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 128px);
  min-height: calc(100vh - 128px);
  overflow: hidden;
  position: relative;
  background: #f8f9fa;
}

@supports (height: 100dvh) {
  .helper-page {
    height: calc(100dvh - 128px);
    min-height: calc(100dvh - 128px);
  }
}

/* 侧边栏 */
.sidebar {
  position: relative;
  z-index: 10;
}

/* 聊天卡片 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1400px;
  width: calc(100% - 32px);
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片内容区 */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  min-height: 0;
}

/* 头部 */
.chat-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 5;
  position: relative;
  flex-shrink: 0;
}

/* 按钮 */
.glass-btn {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.glass-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.glass-btn:active {
  transform: translateY(0);
}

.glass-btn .icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2878%) hue-rotate(211deg) brightness(95%) contrast(101%);
}

/* 头部标题区 */
.header-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 状态徽章 */
.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* 头部操作按钮 */
.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
}

.btn-label {
  display: inline-block;
}

@media (max-width: 768px) {
  .btn-label {
    display: none;
  }
}

/* 数字人悬浮按钮 */
.digital-human-fab {
  position: absolute;
  bottom: 100px;
  right: 32px;
  z-index: 1000;
}

.fab-button {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.fab-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.fab-button:active {
  transform: translateY(-2px) scale(1);
}

.fab-button .icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(100%);
  z-index: 2;
  position: relative;
}

.fab-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: ripple 2s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 数字人全屏遮罩层 */
.digital-human-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

/* 数字人面板 */
.digital-human-panel {
  width: 100%;
  max-width: 1400px;
  height: 100%;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.digital-human-header {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
}

.digital-human-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: rotate(90deg);
}

.close-btn .icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(93%) saturate(4661%) hue-rotate(344deg) brightness(91%) contrast(91%);
}

.digital-human-content {
  flex: 1;
  min-height: 0;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
}

.digital-human-content > * {
  width: 100%;
  height: 100%;
}

/* 过渡动画 */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-active .digital-human-panel,
.modal-fade-leave-active .digital-human-panel {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-enter-from .digital-human-panel {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-leave-to .digital-human-panel {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .helper-page {
    position: relative;
  }

  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  }

  .chat-main {
    margin: 0 auto;
    width: calc(100% - 32px);
    border-radius: 12px;
  }

  .chat-main.sidebar-open {
    transform: translateX(280px);
  }

  .chat-header {
    padding: 16px;
  }

  .header-title h2 {
    font-size: 16px;
  }

  .digital-human-fab {
    bottom: 90px;
    right: 20px;
  }

  .fab-button {
    width: 56px;
    height: 56px;
  }

  .digital-human-overlay {
    padding: 0;
  }

  .digital-human-panel {
    max-height: 100vh;
    border-radius: 0;
  }

  .digital-human-header {
    padding: 16px 20px;
  }

  .digital-human-header h3 {
    font-size: 18px;
  }
}
</style>
