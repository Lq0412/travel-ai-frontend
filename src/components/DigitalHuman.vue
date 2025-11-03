<template>
  <div class="digital-human-container" ref="containerRef">
    <!-- 数字人 Canvas 容器 -->
    <div class="canvas-wrapper">
      <canvas id="canvas_video" ref="canvasVideoRef"></canvas>
      <canvas id="canvas_gl" ref="canvasGlRef" width="128" height="128"></canvas>
      <canvas id="canvasEl" ref="canvasElRef"></canvas>
    </div>

    <!-- 对话界面 iframe（如果需要显示对话界面） -->
    <iframe
      v-if="showDialog"
      id="screen2"
      ref="dialogIframeRef"
      src="http://localhost:8888/static/dialog_RealTime.html"
      frameborder="0"
      style="display: none;"
    ></iframe>

    <!-- 控制面板 -->
    <div class="controls-panel" v-if="showControls">
      <div class="control-group">
        <label for="characterDropdown">角色选择：</label>
        <select id="characterDropdown" v-model="selectedCharacter" @change="onCharacterChange">
          <option value="assets">男性一</option>
          <option value="assets2">女性一</option>
          <option value="assets3">测试角色</option>
        </select>
      </div>
      <div class="control-group">
        <label for="voiceDropdown">语音选择：</label>
        <select id="voiceDropdown" v-model="selectedVoice" @change="onVoiceChange">
          <option value="0">温柔女</option>
          <option value="1">温柔男</option>
          <option value="2">甜美女</option>
          <option value="3">青年女</option>
          <option value="4">磁性男</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <strong>MiniMates: loading...</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface Props {
  // 数字人资源基础URL（默认是后端服务器）
  baseUrl?: string
  // 是否显示对话界面
  showDialog?: boolean
  // 是否显示控制面板
  showControls?: boolean
  // 初始选择的角色
  initialCharacter?: 'assets' | 'assets2' | 'assets3'
  // 初始选择的语音
  initialVoice?: string
}

const props = withDefaults(defineProps<Props>(), {
  baseUrl: 'http://localhost:8888/static',
  showDialog: false,
  showControls: true,
  initialCharacter: 'assets',
  initialVoice: '0'
})

const emit = defineEmits<{
  loaded: []
  error: [error: Error]
}>()

// Refs
const containerRef = ref<HTMLElement | null>(null)
const canvasVideoRef = ref<HTMLCanvasElement | null>(null)
const canvasGlRef = ref<HTMLCanvasElement | null>(null)
const canvasElRef = ref<HTMLCanvasElement | null>(null)
const dialogIframeRef = ref<HTMLIFrameElement | null>(null)

// 状态
const isLoading = ref(true)
const selectedCharacter = ref(props.initialCharacter)
const selectedVoice = ref(props.initialVoice)

// 存储脚本加载状态
let scriptsLoaded = false
let moduleInstance: any = null

// 加载必要的 JavaScript 库
async function loadScripts() {
  if (scriptsLoaded) return

  const scripts = [
    `${props.baseUrl}/js/pako.min.js`,
    `${props.baseUrl}/js/mp4box.all.min.js`,
    `${props.baseUrl}/js/DHLiveMini.js`,
    `${props.baseUrl}/js/MiniMateLoader.js`,
    `${props.baseUrl}/js/MiniLive2.js`
  ]

  for (const src of scripts) {
    await loadScript(src)
  }

  scriptsLoaded = true
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

// 初始化数字人
async function initDigitalHuman() {
  try {
    isLoading.value = true

    // 确保容器和 Canvas 已渲染
    await nextTick()

    // 设置全局 Canvas 引用（数字人库需要）
    if (canvasVideoRef.value) {
      window.canvas_video = canvasVideoRef.value
    }
    if (canvasGlRef.value) {
      window.canvas_gl = canvasGlRef.value
    }
    if (canvasElRef.value) {
      window.canvasEl = canvasElRef.value
    }

    // 创建必要的 DOM 元素
    const screen = createScreenElement()
    const spinner = createSpinnerElement()

    const showUi = () => {
      if (spinner) spinner.style.display = 'none'
      if (screen) screen.style.display = 'block'
      isLoading.value = false
      emit('loaded')
    }

    // 加载脚本
    await loadScripts()

    // 等待全局变量可用
    await waitForGlobals()

    // 初始化 MiniMate Loader
    if (window.qtLoad && window.createQtAppInstance && !moduleInstance) {
      moduleInstance = await window.qtLoad({
        qt: {
          onLoaded: () => showUi(),
          entryFunction: window.createQtAppInstance,
          containerElements: [screen],
        }
      })
    }

    // 初始化视频任务
    if (window.newVideoTask) {
      await window.newVideoTask()
    }

    // 显示对话界面（如果需要）
    if (props.showDialog && dialogIframeRef.value) {
      dialogIframeRef.value.style.display = 'block'
    }

  } catch (error) {
    console.error('初始化数字人失败:', error)
    isLoading.value = false
    emit('error', error as Error)
  }
}

// 等待全局变量可用
function waitForGlobals(): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttempts = 100 // 10秒超时
    
    const checkInterval = setInterval(() => {
      attempts++
      const hasAllGlobals = !!(
        window.pako &&
        window.MP4Box &&
        typeof window.createQtAppInstance !== 'undefined' &&
        typeof window.qtLoad !== 'undefined' &&
        typeof window.newVideoTask !== 'undefined'
      )
      
      if (hasAllGlobals || attempts >= maxAttempts) {
        clearInterval(checkInterval)
        resolve() // 即使超时也继续
      }
    }, 100)
  })
}

// 创建必要的 DOM 元素
function createScreenElement(): HTMLElement {
  // 检查是否已存在
  let screen = document.getElementById('screen')
  if (!screen) {
    screen = document.createElement('div')
    screen.id = 'screen'
    screen.style.cssText = 'position: absolute; bottom: -1000; right: -1000; width: 1px; height: 1px;'
    if (containerRef.value) {
      containerRef.value.appendChild(screen)
    }
  }
  return screen
}

function createSpinnerElement(): HTMLElement {
  // 检查是否已存在
  let spinner = document.getElementById('loadingSpinner')
  if (!spinner) {
    spinner = document.createElement('figure')
    spinner.id = 'loadingSpinner'
    spinner.style.cssText = 'overflow: visible;'
    spinner.innerHTML = '<strong>MiniMates: loading...</strong>'
    if (containerRef.value) {
      containerRef.value.appendChild(spinner)
    }
  }
  return spinner
}

// 角色切换处理
function onCharacterChange() {
  // 这里需要调用数字人的切换角色方法
  // 具体实现取决于 MiniLive2.js 暴露的 API
  if (window.switchCharacter) {
    window.switchCharacter(selectedCharacter.value)
  }
  console.log('切换角色:', selectedCharacter.value)
}

// 语音切换处理
function onVoiceChange() {
  // 通过 iframe 或者直接设置全局变量
  const dialogFrame = dialogIframeRef.value?.contentWindow as any
  if (dialogFrame?.voiceDropdown) {
    dialogFrame.voiceDropdown.value = selectedVoice.value
  }
  console.log('切换语音:', selectedVoice.value)
}

// 设置 Canvas ID（数字人库依赖特定的 ID）
function setupCanvasIds() {
  if (canvasVideoRef.value) {
    canvasVideoRef.value.id = 'canvas_video'
    canvasVideoRef.value.style.cssText = 
      'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;'
  }
  if (canvasGlRef.value) {
    canvasGlRef.value.id = 'canvas_gl'
    canvasGlRef.value.style.cssText = 
      'position: absolute; top: -9999px; left: -9999px; width: 128px; height: 128px;'
  }
  if (canvasElRef.value) {
    canvasElRef.value.id = 'canvasEl'
    canvasElRef.value.style.cssText = 
      'position: absolute; left: -9999px; top: -9999px; width: 300px; height: 150px;'
  }
}

// 生命周期
onMounted(async () => {
  setupCanvasIds()
  await initDigitalHuman()
})

onBeforeUnmount(() => {
  // 清理资源
  if (moduleInstance && moduleInstance.cleanup) {
    moduleInstance.cleanup()
  }
})

// 监听角色变化
watch(selectedCharacter, (newVal) => {
  onCharacterChange()
})

// 监听语音变化
watch(selectedVoice, (newVal) => {
  onVoiceChange()
})

// 声明全局类型（如果需要）
declare global {
  interface Window {
    pako: any
    MP4Box: any
    createQtAppInstance: any
    qtLoad: any
    newVideoTask: () => Promise<void>
    switchCharacter?: (character: string) => void
    canvas_video?: HTMLCanvasElement
    canvas_gl?: HTMLCanvasElement
    canvasEl?: HTMLCanvasElement
  }
}
</script>

<style scoped>
.digital-human-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

#canvas_video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#canvas_gl {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 128px;
  height: 128px;
}

#canvasEl {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 300px;
  height: 150px;
}

.controls-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.control-group {
  margin-bottom: 12px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.control-group select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 10px 40px 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  background-color: #fff;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
  min-width: 180px;
}

.control-group select:hover {
  border-color: #888;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.control-group select:focus {
  border-color: #007bff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(240, 240, 240, 0.9);
  z-index: 100;
}

.loading-spinner {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>

