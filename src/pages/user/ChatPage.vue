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

    <!-- 主内容区域 -->
    <div class="chat-main" :class="{ 'sidebar-open': showSidebar }">
      <div class="chat-header">
        <button @click="showSidebar = !showSidebar" class="menu-btn">☰</button>
        <h2>旅行助手</h2>
        <button @click="handleNew" class="new-chat-btn">新对话</button>
      </div>

      <ChatWindow ref="windowRef" @update:loading="(v) => (isLoading = v)" />

      <ChatInput :disabled="isLoading" placeholder="随便问我什么..." @send-message="onSend" />
    </div>

    <!-- 数字人按钮（固定在输入框上方） -->
    <div class="digital-human-button-area">
      <button 
        @click="toggleDigitalHuman" 
        class="digital-human-toggle-btn"
        :class="{ active: showDigitalHuman }"
        title="数字人助手"
      >
        <span class="btn-icon">🤖</span>
        <span class="btn-text">{{ showDigitalHuman ? '关闭数字人' : '打开数字人' }}</span>
      </button>
    </div>

    <!-- 数字人全屏面板 -->
    <transition name="fade">
      <div v-if="showDigitalHuman" class="digital-human-overlay" @click.self="toggleDigitalHuman">
        <div class="digital-human-panel">
          <div class="digital-human-header">
            <h3>数字人助手</h3>
            <button @click="toggleDigitalHuman" class="close-digital-human-btn" title="关闭">×</button>
          </div>
          <div class="digital-human-content">
            <DigitalHumanIframe
              src="http://localhost:8888/static/MiniLive_RealTime.html"
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
.helper-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.sidebar {
  position: relative;
  z-index: 10;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  position: relative;
  transition: transform 0.3s ease;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: white;
  z-index: 5;
}

.menu-btn, .new-chat-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.menu-btn:hover, .new-chat-btn:hover {
  background-color: #f8f9fa;
}

.chat-header h2 {
  margin: 0;
  flex: 1;
  font-size: 18px;
  color: #333;
}

/* 数字人按钮区域 */
.digital-human-button-area {
  position: fixed;
  bottom: 100px; /* 在输入框上方，根据输入框高度调整 */
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background-color: rgba(255, 255, 255, 0.98);
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* 确保在输入框(z-index:1000)之上 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.digital-human-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  min-width: 160px;
  justify-content: center;
}

.digital-human-toggle-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.digital-human-toggle-btn.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.digital-human-toggle-btn .btn-icon {
  font-size: 18px;
  line-height: 1;
}

.digital-human-toggle-btn .btn-text {
  white-space: nowrap;
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
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  .chat-main.sidebar-open {
    transform: translateX(300px);
  }

  .chat-main.digital-human-open {
    margin-right: 400px;
  }
}

/* 数字人全屏遮罩层 */
.digital-human-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 数字人面板 */
.digital-human-panel {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.digital-human-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.digital-human-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.digital-human-header h3::before {
  content: '🤖';
  font-size: 24px;
}

.close-digital-human-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 300;
  line-height: 1;
}

.close-digital-human-btn:hover {
  background-color: #e9ecef;
  color: #333;
}

.digital-human-content {
  flex: 1;
  min-height: 0;
  position: relative;
  background-color: #f0f0f0;
}

.digital-human-content > * {
  width: 100%;
  height: 100%;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-active .digital-human-panel,
.fade-leave-active .digital-human-panel {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-from .digital-human-panel {
  transform: scale(0.9);
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-to .digital-human-panel {
  transform: scale(0.9);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
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
