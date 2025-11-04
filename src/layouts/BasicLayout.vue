<template>
  <!-- 后台管理布局 - 包含侧边栏和顶部栏 -->
  <div id="basicLayout" :style="{'--content-left': collapsed ? '80px' : '200px'}">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout>
        <GlobalSider
          class="sider"
          :collapsed="collapsed"
          @toggle-collapse="toggleCollapse"
        />

        <!-- Main Content -->
        <a-layout-content
          class="content"
          :style="{ marginLeft: collapsed ? '80px' : '200px' }"
        >
          <router-view :key="$route.fullPath" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'

const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
/* Layout Container */
#basicLayout {
  --content-left: 200px; /* Default value */
}

/* Header Styles */
.header {
  position: relative;
  z-index: 90; /* Below sider but above content */
  padding: 0;
  background: transparent;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Sider Styles */
.sider {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100; /* 保持低于模态框 */
  transition: width 0.2s ease, transform 0.2s ease;
}

.content {
  position: relative;
  z-index: 50;
  margin-left: var(--content-left);
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .sider {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .content {
    margin-left: 0 !important;
  }
}

</style>
