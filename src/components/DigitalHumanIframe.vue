<template>
  <div class="digital-human-iframe-container">
    <iframe
      :src="iframeSrc"
      frameborder="0"
      allow="microphone; camera"
      class="digital-human-iframe"
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  // 数字人页面URL
  src?: string
  // 是否自动调整大小
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: 'http://127.0.0.1:8888/static/MiniLive_RealTime.html',
  autoResize: true
})

const emit = defineEmits<{
  loaded: []
  error: [error: Event]
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)

// 添加时间戳以避免缓存（只在组件创建时生成一次，避免频繁重新加载）

const cacheBuster = ref(Date.now())
const iframeSrc = computed(() => {
  const baseUrl = props.src || 'http://127.0.0.1:8888/static/MiniLive_RealTime.html'
  try {
    const url = new URL(baseUrl)
    url.searchParams.set('v', String(cacheBuster.value))
    return url.toString()
  } catch {
    // 如果 URL 解析失败，直接添加参数
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}v=${cacheBuster.value}`
  }
})

// 组件挂载时确保 URL 已设置
onMounted(() => {
  // 确保 cacheBuster 有值（防止缓存）
  if (!cacheBuster.value) {
    cacheBuster.value = Date.now()
  }
})

function onIframeLoad(event: Event) {
  const iframe = event.target as HTMLIFrameElement
  iframeRef.value = iframe
  
  // 尝试访问 iframe 内容（可能需要处理跨域）
  try {
    const iframeWindow = iframe.contentWindow
    if (iframeWindow) {
      console.log('数字人 iframe 加载成功')
      emit('loaded')
    }
  } catch (error) {
    // 跨域情况下无法访问，但 iframe 可能已经加载
    console.warn('无法访问 iframe 内容（可能跨域）:', error)
    emit('loaded')
  }
}
</script>

<style scoped>
.digital-human-iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.digital-human-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>

