<template>
  <div class="conversation-sidebar">
    <div class="sidebar-header">
      <h3>对话历史</h3>
      <button @click="$emit('close')" class="close-btn">×</button>
    </div>
    <div class="conversation-list">
      <div
        v-for="c in conversations"
        :key="c.id"
        class="conversation-item"
        :class="{ active: String(c.id) === activeId }"
      >
        <div class="conversation-content" @click="$emit('switch', String(c.id))">
          <div class="conversation-title">{{ c.title }}</div>
          <div class="conversation-time">{{ c.updateTime }}</div>
        </div>
        <button class="delete-btn" @click.stop="$emit('delete', String(c.id))">🗑️</button>
      </div>
    </div>
    <div class="sidebar-footer">
      <button class="new-chat-btn" @click="$emit('new')">新对话</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Conversation } from '@/types/chat'

defineProps<{ conversations: Conversation[]; activeId: string | null }>()
</script>

<style scoped>
.conversation-sidebar {
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.conversation-item {
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.conversation-item.active {
  background-color: #007bff;
  color: white;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0.6;
}
.delete-btn:hover {
  background-color: #dc3545;
  color: white;
  opacity: 1;
}
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #e1e5e9;
}
.new-chat-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
