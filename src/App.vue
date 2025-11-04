<template>
  <div id="app">
    <!-- 根据路由 meta 决定是否使用布局 -->
    <component :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BasicLayout from './layouts/BasicLayout.vue'
import LandingLayout from './layouts/LandingLayout.vue'
import TopNavLayout from './layouts/TopNavLayout.vue'

const route = useRoute()

// 根据路由 meta 动态选择布局
const layoutComponent = computed(() => {
  const layout = route.meta?.layout as string | undefined
  
  switch (layout) {
    case 'landing':
      return LandingLayout
    case 'topnav':
      return TopNavLayout
    case 'none':
      return 'router-view' // 直接渲染页面，无布局
    default:
      return BasicLayout
  }
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
