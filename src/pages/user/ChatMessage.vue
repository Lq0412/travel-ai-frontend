<template>
  <div class="chat-message" :class="{ 'user-message': isUser, 'ai-message': !isUser }">
    <div class="message-avatar">
      <div class="avatar" :class="{ 'user-avatar': isUser, 'ai-avatar': !isUser }">
        <img :src="isUser ? userAvatar : aiAvatar" :alt="isUser ? '用户头像' : 'AI头像'" />
      </div>
    </div>
    <div class="message-content">
      <div class="message-bubble">
        <pre v-if="isUser" class="message-text">{{ message }}</pre>
        <div v-else>
          <!-- 添加切换按钮 -->
          <div class="debug-toggle" v-if="hasDebugInfo">
            <button @click="showDebug = !showDebug" class="debug-btn">
              {{ showDebug ? '隐藏思考过程' : '显示思考过程' }}
            </button>
          </div>

          <!-- 调试信息（思考过程） -->
          <div v-if="showDebug && hasDebugInfo" class="debug-info">
            <div class="debug-section">
              <strong>🧠 思考:</strong>
              <div class="debug-content">{{ parsedData.reasoning }}</div>
            </div>
            <div class="debug-section">
              <strong>⚡ 行动:</strong>
              <div class="debug-content">{{ parsedData.action }}</div>
            </div>
          </div>

          <!-- 最终回复 -->
          <div class="message-markdown" v-html="renderedMessage"></div>
        </div>
      </div>
      <div class="message-time">{{ formatTime(timestamp) }}</div>
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
.chat-message {
  display: flex;
  margin-bottom: 20px;
  padding: 0 20px;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-avatar {
  display: flex;
  align-items: flex-start;
  margin: 0 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.user-message .message-avatar {
  order: 2;
}

.user-message .message-content {
  order: 1;
}

.ai-message .message-avatar {
  order: 1;
}

.ai-message .message-content {
  order: 2;
}

.user-avatar {
  background-color: #007bff;
}

.ai-avatar {
  background-color: #6c757d; /* 统一使用这个颜色 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease;
}

.avatar img:not([src]) {
  opacity: 0;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
}

.user-message .message-bubble {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .message-bubble {
  background-color: #edefef;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-text,
.message-markdown {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.message-markdown {
  line-height: 1.5;
}

.message-markdown code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.message-markdown pre {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.message-markdown pre code {
  background-color: transparent;
  padding: 0;
}

.message-markdown blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  margin: 0.5em 0;
  font-style: italic;
  color: #666;
}

.message-time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  padding: 0 4px;
}

@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }

  .chat-message {
    padding: 0 10px;
  }
}

/* 新增调试信息样式 */
.debug-toggle {
  margin-bottom: 10px;
  text-align: right;
}

.debug-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}

.debug-btn:hover {
  background: #e0e0e0;
}

.debug-info {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  border-left: 3px solid #007bff;
}

.debug-section {
  margin-bottom: 8px;
}

.debug-section:last-child {
  margin-bottom: 0;
}

.debug-section strong {
  display: block;
  margin-bottom: 4px;
  color: #007bff;
}

.debug-content {
  padding-left: 8px;
  font-size: 13px;
  line-height: 1.4;
}
</style>
