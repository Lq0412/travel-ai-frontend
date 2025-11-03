<template>
  <div class="chat-input">
    <div class="input-container">
      <textarea
        ref="inputRef"
        v-model="inputMessage"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-textarea"
        rows="1"
        @keydown="handleKeyDown"
        @input="adjustHeight"
      />
      <button
        :disabled="disabled || !inputMessage.trim()"
        @click="sendMessage"
        class="send-button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChatInput',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '随便问我什么...'
    }
  },
  data() {
    return {
      inputMessage: '',
    }
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim() && !this.disabled) {
        this.$emit('send-message', this.inputMessage.trim())
        this.inputMessage = ''
        this.adjustHeight()
      }
    },
    handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },
    adjustHeight() {
      this.$nextTick(() => {
        const textarea = this.$refs.inputRef as unknown as HTMLTextAreaElement | undefined
        if (!textarea) return
        textarea.style.height = 'auto'
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
      })
    },
    focus() {
      const textarea = this.$refs.inputRef as unknown as HTMLTextAreaElement | undefined
      try {
        textarea?.focus({ preventScroll: true } as FocusOptions)
      } catch {
        textarea?.focus()
      }
    }
  },
  mounted() {
    this.adjustHeight()
  }
}
</script>

<style scoped>
.chat-input {
  position: fixed;
  bottom: 0;
  left: calc(var(--content-left, 0px) + 16px);
  right: 16px;
  width: calc(100% - var(--content-left, 0px) - 32px);
  max-width: calc(100% - var(--content-left, 0px) - 32px);
  z-index: 1000;
  background: white;
  border-top: 1px solid #e1e5e9;
  padding: 20px;
  box-sizing: border-box;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.input-textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
}

.input-textarea:focus {
  border-color: #007bff;
}

.input-textarea:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.send-button {
  width: 44px;
  height: 44px;
  background-color: #007bff;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-input {
    padding: 15px;
  }

  .input-container {
    gap: 8px;
  }

  .input-textarea {
    font-size: 16px;
  }
}
</style>

