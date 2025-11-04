<template>
  <div class="conversation-sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <div class="header-content">
        <img src="https://unpkg.com/lucide-static@latest/icons/message-square.svg" alt="" class="header-icon" />
        <h3>对话历史</h3>
      </div>
      <button @click="$emit('close')" class="close-btn" aria-label="关闭">
        <img src="https://unpkg.com/lucide-static@latest/icons/x.svg" alt="关闭" class="icon" />
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <img src="https://unpkg.com/lucide-static@latest/icons/search.svg" alt="" class="search-icon" />
      <input 
        type="text" 
        placeholder="搜索对话..." 
        class="search-input"
        v-model="searchQuery"
      />
    </div>

    <!-- 对话列表 -->
    <div class="conversation-list">
      <div v-if="filteredConversations.length === 0" class="empty-state">
        <img src="https://unpkg.com/lucide-static@latest/icons/inbox.svg" alt="" class="empty-icon" />
        <p>{{ searchQuery ? '未找到匹配的对话' : '暂无对话历史' }}</p>
      </div>
      <div
        v-for="c in filteredConversations"
        :key="c.id"
        class="conversation-item"
        :class="{ active: String(c.id) === activeId }"
      >
        <div class="conversation-content" @click="$emit('switch', String(c.id))">
          <div class="conversation-header">
            <img src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" alt="" class="item-icon" />
            <div class="conversation-title">{{ c.title }}</div>
          </div>
          <div class="conversation-time">
            <img src="https://unpkg.com/lucide-static@latest/icons/clock.svg" alt="" class="time-icon" />
            {{ c.updateTime }}
          </div>
        </div>
        <button class="delete-btn" @click.stop="$emit('delete', String(c.id))" title="删除">
          <img src="https://unpkg.com/lucide-static@latest/icons/trash-2.svg" alt="删除" class="icon" />
        </button>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="sidebar-footer">
      <button class="new-chat-btn" @click="$emit('new')">
        <img src="https://unpkg.com/lucide-static@latest/icons/plus.svg" alt="" class="btn-icon" />
        <span>新建对话</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Conversation } from '@/types/chat'

const props = defineProps<{ conversations: Conversation[]; activeId: string | null }>()

const searchQuery = ref('')

// 过滤对话列表
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.conversations
  }
  return props.conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
/* 侧边栏容器 */
.conversation-sidebar {
  width: 320px;
  min-width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  width: 22px;
  height: 22px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: rotate(90deg);
}

.close-btn .icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(93%) saturate(4661%) hue-rotate(344deg) brightness(91%) contrast(91%);
}

/* 搜索框 */
.search-box {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
}

.search-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(62%) sepia(9%) saturate(363%) hue-rotate(181deg) brightness(89%) contrast(87%);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* 对话列表 */
.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* 自定义滚动条 */
.conversation-list::-webkit-scrollbar {
  width: 6px;
}

.conversation-list::-webkit-scrollbar-track {
  background: transparent;
}

.conversation-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.conversation-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  filter: brightness(0) saturate(100%) invert(80%) sepia(6%) saturate(275%) hue-rotate(181deg) brightness(93%) contrast(89%);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
}

/* 对话项 */
.conversation-item {
  padding: 12px;
  margin-bottom: 6px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.conversation-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.conversation-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(99, 102, 241, 0.2);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.conversation-item:hover::before {
  opacity: 1;
}

.conversation-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: rgba(99, 102, 241, 0.3);
}

.conversation-item.active::before {
  opacity: 1;
}

.conversation-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.conversation-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(221deg) brightness(98%) contrast(101%);
  flex-shrink: 0;
}

.conversation-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.conversation-item.active .conversation-title {
  color: #4f46e5;
}

.conversation-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  padding-left: 24px;
}

.time-icon {
  width: 12px;
  height: 12px;
  filter: brightness(0) saturate(100%) invert(62%) sepia(9%) saturate(363%) hue-rotate(181deg) brightness(89%) contrast(87%);
}

/* 删除按钮 */
.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  opacity: 0;
  align-self: center;
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.delete-btn .icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(93%) saturate(4661%) hue-rotate(344deg) brightness(91%) contrast(91%);
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
}

.new-chat-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.new-chat-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(100%);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .conversation-sidebar {
    width: 280px;
    min-width: 280px;
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-header h3 {
    font-size: 16px;
  }

  .search-box {
    padding: 12px 16px;
  }

  .conversation-list {
    padding: 8px;
  }

  .delete-btn {
    opacity: 1; /* 移动端始终显示 */
  }
}
</style>
