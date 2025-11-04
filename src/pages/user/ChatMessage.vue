<template>
  <div class="chat-message" :class="{ 'user-message': isUser, 'ai-message': !isUser }">
    <div class="message-avatar">
      <div class="avatar" :class="{ 'user-avatar': isUser, 'ai-avatar': !isUser }">
        <img 
          v-if="isUser"
          src="https://unpkg.com/lucide-static@latest/icons/user.svg" 
          alt="用户" 
          class="avatar-icon"
        />
        <img 
          v-else
          src="https://unpkg.com/lucide-static@latest/icons/bot.svg" 
          alt="AI" 
          class="avatar-icon"
        />
      </div>
    </div>
    <div class="message-content">
      <div class="message-bubble">
        <pre v-if="isUser" class="message-text">{{ message }}</pre>
        <div v-else>
          <!-- 思考过程切换按钮 -->
          <div class="debug-toggle" v-if="hasDebugInfo">
            <button @click="showDebug = !showDebug" class="debug-btn">
              <img 
                :src="showDebug ? 'https://unpkg.com/lucide-static@latest/icons/eye-off.svg' : 'https://unpkg.com/lucide-static@latest/icons/eye.svg'" 
                alt="" 
                class="btn-icon" 
              />
              <span>{{ showDebug ? '隐藏思考过程' : '显示思考过程' }}</span>
            </button>
          </div>

          <!-- 思考过程面板 -->
          <transition name="expand">
            <div v-if="showDebug && hasDebugInfo" class="debug-panel">
              <div class="debug-section">
                <div class="section-header">
                  <img src="https://unpkg.com/lucide-static@latest/icons/brain.svg" alt="" class="section-icon" />
                  <strong>思考</strong>
                </div>
                <div class="debug-content">{{ parsedData.reasoning }}</div>
              </div>
              <div class="debug-section">
                <div class="section-header">
                  <img src="https://unpkg.com/lucide-static@latest/icons/zap.svg" alt="" class="section-icon" />
                  <strong>行动</strong>
                </div>
                <div class="debug-content">{{ parsedData.action }}</div>
              </div>
            </div>
          </transition>

          <!-- AI回复内容 -->
          <div class="message-markdown" v-html="renderedMessage"></div>
        </div>
      </div>
      <div class="message-footer">
        <div class="message-time">{{ formatTime(timestamp) }}</div>
        <div v-if="!isUser" class="message-actions">
          <button class="action-btn" title="复制">
            <img src="https://unpkg.com/lucide-static@latest/icons/copy.svg" alt="复制" class="icon" />
          </button>
          <button class="action-btn" title="重新生成">
            <img src="https://unpkg.com/lucide-static@latest/icons/refresh-cw.svg" alt="重新生成" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { marked } from 'marked'
import { formatChatTime } from '@/util/timeUtils'
import userAvatar from '@/assets/user-avatar.jpg'
import aiAvatar from '@/assets/user-avatar.jpg'

export default defineComponent({
  name: 'ChatMessage',
  props: {
    message: { type: String, required: true },
    isUser: { type: Boolean, default: false },
    timestamp: { type: [Date, String, Number], default: () => new Date() },
  },
  setup(props) {
    const showDebug = ref(false)

    // 解析后端响应
    const parsedData = computed(() => {
      if (props.isUser) return { reasoning: '', action: '', observation: props.message }

      const messageText = typeof props.message === 'string'
        ? props.message
        : String(props.message || '')

      // 默认值
      const result = {
        reasoning: '',
        action: '',
        observation: messageText
      }

      try {
        // 解析三段式响应
        const regex = /思考[:：]\s*(.*?)\s*行动[:：]\s*(.*?)\s*观察[:：]\s*([\s\S]*)/i
        const match = messageText.match(regex)

        if (match && match.length >= 4) {
          result.reasoning = match[1].trim()
          result.action = match[2].trim()
          result.observation = match[3].trim()
        }
      } catch (e) {
        console.error('解析AI响应失败', e)
      }

      return result
    })

    // 检查是否有调试信息
    const hasDebugInfo = computed(() => {
      return !props.isUser &&
        parsedData.value.reasoning &&
        parsedData.value.action
    })

    // 渲染最终回复
    const renderedMessage = computed(() => {
      if (props.isUser) return props.message

      try {
        marked.setOptions({ breaks: true, gfm: true })
        return marked.parse(parsedData.value.observation)
      } catch (error) {
        console.error('Markdown解析错误:', error)
        return parsedData.value.observation
      }
    })

    return {
      renderedMessage,
      formatTime: formatChatTime,
      userAvatar,
      aiAvatar,
      parsedData,
      showDebug,
      hasDebugInfo
    }
  },
})
</script>

<style scoped>
/* 消息容器 */
.chat-message {
  display: flex;
  margin-bottom: 24px;
  padding: 0 20px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

/* 头像 */
.message-avatar {
  display: flex;
  align-items: flex-start;
  margin: 0 12px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: rgba(240, 147, 251, 0.2);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.avatar-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(100%);
}

.user-message .message-avatar {
  order: 2;
}

.user-message .message-content {
  order: 1;
  align-items: flex-end;
}

.ai-message .message-avatar {
  order: 1;
}

.ai-message .message-content {
  order: 2;
  align-items: flex-start;
}

/* 消息内容 */
.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 16px;
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .message-bubble {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.ai-message .message-bubble:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 消息文本 */
.message-text,
.message-markdown {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.message-markdown {
  color: #1f2937;
}

.message-markdown code {
  background-color: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.message-markdown pre {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-markdown pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.message-markdown blockquote {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 12px 0;
  font-style: italic;
  color: #6b7280;
  background: rgba(99, 102, 241, 0.05);
  padding: 12px 16px;
  border-radius: 4px;
}

/* 思考过程切换 */
.debug-toggle {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
}

.debug-btn {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  color: #4f46e5;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.debug-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.debug-btn .btn-icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2878%) hue-rotate(211deg) brightness(95%) contrast(101%);
}

/* 思考过程面板 */
.debug-panel {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  overflow: hidden;
}

.debug-section {
  margin-bottom: 12px;
}

.debug-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
}

.section-header strong {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
}

.debug-content {
  padding-left: 24px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* 消息底部 */
.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding: 0 4px;
  gap: 8px;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chat-message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.action-btn .icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-message {
    padding: 0 16px;
    margin-bottom: 20px;
  }

  .message-content {
    max-width: 85%;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .avatar-icon {
    width: 20px;
    height: 20px;
  }

  .message-bubble {
    padding: 12px 14px;
  }

  .message-text,
  .message-markdown {
    font-size: 14px;
  }

  .message-actions {
    opacity: 1; /* 移动端始终显示 */
  }
}
</style>
