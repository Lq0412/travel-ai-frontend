<template>
  <!-- expose content left offset as a CSS variable -->
  <div id="basicLayout" :style="{'--content-left': isAuthPage ? '0px' : (collapsed ? '80px' : '200px')}">
    <a-layout style="min-height: 100vh">
      <a-layout-header v-if="showHeader" class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout>
        <GlobalSider
          v-if="!isAuthPage"
          class="sider"
          :collapsed="collapsed"
          @toggle-collapse="toggleCollapse"
        />

        <!-- Main Content -->
        <a-layout-content
          :class="isAuthPage ? 'auth-content' : 'content'"
          :style="{ marginLeft: isAuthPage ? '0' : collapsed ? '80px' : '200px' }"
        >
          <router-view :key="$route.fullPath" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'

const route = useRoute()
const collapsed = ref(false)

const showHeader = computed(() => {
  return route.path === '/'
})

const isAuthPage = computed(() => {
  const authRoutes = ['/user/login', '/user/register']
  return authRoutes.includes(route.path)
})

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
  z-index: 50; /* 从原来的210降低 */
  margin-left: var(--content-left);
}

/* Auth Page Specific Styles */
.auth-content {
  position: relative;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

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
