<template>
  <div class="top-nav-layout">
    <!-- 动态背景 -->
    <div class="layout-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="top-navbar" :class="{ 'scrolled': isScrolled }">
      <div class="navbar-container">
        <!-- Logo 和品牌 -->
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="logo" class="brand-icon">
            <span class="brand-text">AI 旅游</span>
          </router-link>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="navbar-menu" v-if="!isMobile">
          <template v-for="item in menuItems" :key="item.key">
            <router-link 
              :to="item.path" 
              class="menu-item"
              :class="{ 'active': isActiveRoute(item.path) }"
            >
              <img :src="item.icon" :alt="item.label" class="menu-icon">
              <span>{{ item.label }}</span>
            </router-link>
          </template>
        </nav>
        
        <!-- 右侧操作区 -->
        <div class="navbar-actions">
          <!-- 搜索按钮 -->
          <button class="action-btn" @click="toggleSearch">
            <img src="https://unpkg.com/lucide-static@latest/icons/search.svg" alt="search" class="action-icon">
          </button>
          
          <!-- 通知按钮 -->
          <button class="action-btn notification-btn">
            <img src="https://unpkg.com/lucide-static@latest/icons/bell.svg" alt="notifications" class="action-icon">
            <span class="notification-badge" v-if="hasNotifications">3</span>
          </button>
          
          <!-- 用户菜单 -->
          <div class="user-menu">
            <button class="user-trigger" @click="toggleUserMenu">
              <img 
                :src="loginUserStore.loginUser.userAvatar || 'https://unpkg.com/lucide-static@latest/icons/user-circle.svg'" 
                alt="avatar" 
                class="user-avatar"
                :class="{ 'is-default-avatar': !loginUserStore.loginUser.userAvatar }"
              >
              <div class="user-info" v-if="!isMobile">
                <span class="user-name">{{ loginUserStore.loginUser.userName || '用户' }}</span>
                <span class="user-role">{{ getRoleText(loginUserStore.loginUser.userRole) }}</span>
              </div>
              <img src="https://unpkg.com/lucide-static@latest/icons/chevron-down.svg" alt="down" class="chevron-icon">
            </button>
            
            <!-- 用户下拉菜单 -->
            <transition name="dropdown-fade">
              <div v-if="showUserMenu" class="dropdown-menu" @click.stop>
                <div class="dropdown-header">
                  <img 
                    :src="loginUserStore.loginUser.userAvatar || 'https://unpkg.com/lucide-static@latest/icons/user-circle.svg'" 
                    alt="avatar" 
                    class="dropdown-avatar"
                    :class="{ 'is-default-avatar': !loginUserStore.loginUser.userAvatar }"
                  >
                  <div class="dropdown-user-info">
                    <div class="dropdown-name">{{ loginUserStore.loginUser.userName || '用户' }}</div>
                    <div class="dropdown-email">{{ loginUserStore.loginUser.userAccount || 'user@example.com' }}</div>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <router-link to="/dashboard" class="dropdown-item" @click="closeUserMenu">
                  <img src="https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg" alt="dashboard" class="item-icon">
                  <span>仪表板</span>
                </router-link>
                
                <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                  <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" alt="profile" class="item-icon">
                  <span>个人资料</span>
                </router-link>
                
                <router-link to="/settings" class="dropdown-item" @click="closeUserMenu">
                  <img src="https://unpkg.com/lucide-static@latest/icons/settings.svg" alt="settings" class="item-icon">
                  <span>设置</span>
                </router-link>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item danger" @click="handleLogout">
                  <img src="https://unpkg.com/lucide-static@latest/icons/log-out.svg" alt="logout" class="item-icon">
                  <span>退出登录</span>
                </button>
              </div>
            </transition>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <img src="https://unpkg.com/lucide-static@latest/icons/menu.svg" alt="menu" class="menu-icon">
          </button>
        </div>
      </div>
    </header>
    
    <!-- 搜索面板 -->
    <transition name="slide-down">
      <div v-if="showSearch" class="search-panel">
        <div class="search-container">
          <div class="search-wrapper">
            <img src="https://unpkg.com/lucide-static@latest/icons/search.svg" alt="search" class="search-icon">
            <input 
              type="text" 
              placeholder="搜索景点、商品、攻略..." 
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              ref="searchInput"
            >
            <button class="search-close" @click="toggleSearch">
              <img src="https://unpkg.com/lucide-static@latest/icons/x.svg" alt="close" class="close-icon">
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 移动端菜单 -->
    <transition name="slide-right">
      <div v-if="showMobileMenu" class="mobile-menu">
        <div class="mobile-menu-header">
          <div class="mobile-user-info">
            <img 
              :src="loginUserStore.loginUser.userAvatar || 'https://unpkg.com/lucide-static@latest/icons/user-circle.svg'" 
              alt="avatar" 
              class="mobile-avatar"
              :class="{ 'is-default-avatar': !loginUserStore.loginUser.userAvatar }"
            >
            <div>
              <div class="mobile-name">{{ loginUserStore.loginUser.userName || '用户' }}</div>
              <div class="mobile-role">{{ getRoleText(loginUserStore.loginUser.userRole) }}</div>
            </div>
          </div>
          <button class="close-mobile-menu" @click="toggleMobileMenu">
            <img src="https://unpkg.com/lucide-static@latest/icons/x.svg" alt="close" class="close-icon">
          </button>
        </div>
        
        <nav class="mobile-nav">
          <router-link 
            v-for="item in menuItems" 
            :key="item.key"
            :to="item.path" 
            class="mobile-nav-item"
            :class="{ 'active': isActiveRoute(item.path) }"
            @click="closeMobileMenu"
          >
            <img :src="item.icon" :alt="item.label" class="nav-icon">
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
        
        <div class="mobile-menu-footer">
          <button class="mobile-logout-btn" @click="handleLogout">
            <img src="https://unpkg.com/lucide-static@latest/icons/log-out.svg" alt="logout" class="logout-icon">
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </transition>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-container">
        <router-view />
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="layout-footer">
      <div class="footer-content">
        <p>&copy; 2025 AI 旅游推荐平台. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">隐私政策</a>
          <a href="#">服务条款</a>
          <a href="#">帮助中心</a>
        </div>
      </div>
    </footer>
    
    <!-- 遮罩层（用于关闭菜单） -->
    <transition name="fade">
      <div 
        v-if="showUserMenu || showMobileMenu" 
        class="overlay" 
        @click="closeAllMenus"
      ></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogout } from '@/api/userController'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const isScrolled = ref(false)
const showSearch = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')
const hasNotifications = ref(true)
const isMobile = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 968
}

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 根据角色获取菜单项
const menuItems = computed(() => {
  const userRole = loginUserStore.loginUser.userRole
  
  const commonItems = [
    { key: 'dashboard', label: '仪表板', path: '/dashboard', icon: 'https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg' },
    { key: 'forum', label: '论坛', path: '/user/forum', icon: 'https://unpkg.com/lucide-static@latest/icons/message-square.svg' },
    { key: 'ai', label: 'AI助手', path: '/user/helper', icon: 'https://unpkg.com/lucide-static@latest/icons/bot.svg' },
    { key: 'message', label: '留言墙', path: '/message-wall', icon: 'https://unpkg.com/lucide-static@latest/icons/message-circle.svg' },
  ]
  
  if (userRole === 'admin') {
    return [
      ...commonItems,
      { key: 'users', label: '用户管理', path: '/admin/userManage', icon: 'https://unpkg.com/lucide-static@latest/icons/users.svg' },
      { key: 'merchants', label: '商家管理', path: '/admin/merchantManage', icon: 'https://unpkg.com/lucide-static@latest/icons/store.svg' },
      { key: 'products', label: '商品管理', path: '/admin/productManage', icon: 'https://unpkg.com/lucide-static@latest/icons/package.svg' },
    ]
  } else if (userRole === 'merchant') {
    return [
      ...commonItems,
      { key: 'my-products', label: '我的商品', path: '/merchant/products', icon: 'https://unpkg.com/lucide-static@latest/icons/package.svg' },
      { key: 'orders', label: '订单管理', path: '/merchant/orders', icon: 'https://unpkg.com/lucide-static@latest/icons/shopping-cart.svg' },
      { key: 'settings', label: '商家设置', path: '/merchant/settings', icon: 'https://unpkg.com/lucide-static@latest/icons/settings.svg' },
    ]
  } else {
    return [
      ...commonItems,
      { key: 'shops', label: '商家店铺', path: '/user/shop', icon: 'https://unpkg.com/lucide-static@latest/icons/store.svg' },
      { key: 'cart', label: '购物车', path: '/user/cart', icon: 'https://unpkg.com/lucide-static@latest/icons/shopping-cart.svg' },
      { key: 'my-orders', label: '我的订单', path: '/user/orders', icon: 'https://unpkg.com/lucide-static@latest/icons/file-text.svg' },
    ]
  }
})

// 判断路由是否激活
const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// 获取角色文本
const getRoleText = (role: string | undefined) => {
  const roleMap: Record<string, string> = {
    'admin': '管理员',
    'merchant': '商家',
    'user': '普通用户'
  }
  return roleMap[role || 'user'] || '普通用户'
}

// 切换搜索
const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    message.info(`搜索: ${searchQuery.value}`)
    // TODO: 实现搜索功能
  }
}

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 关闭用户菜单
const closeUserMenu = () => {
  showUserMenu.value = false
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 关闭所有菜单
const closeAllMenus = () => {
  showUserMenu.value = false
  showMobileMenu.value = false
}

// 退出登录
const handleLogout = async () => {
  try {
    const res = await userLogout()
    if (res.data.code === 0) {
      loginUserStore.setLoginUser({ userName: '未登录' })
      message.success('退出登录成功')
      await router.push('/user/login')
    } else {
      message.error('退出登录失败，' + res.data.message)
    }
  } catch (error) {
    message.error('退出登录失败')
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
  if (!isMobile.value) {
    showMobileMenu.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

// 路由变化时关闭菜单
watch(() => route.path, () => {
  closeAllMenus()
})
</script>

<style scoped lang="scss">
.top-nav-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  position: relative;
}

// 动态背景
.layout-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: float-orb 25s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -20%;
  right: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -15%;
  left: -10%;
  animation-delay: 10s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 40%;
  left: 30%;
  animation-delay: 20s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -60px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 40px) scale(0.9);
  }
}

// 顶部导航栏 - 性能优化版
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background 0.3s ease, box-shadow 0.3s ease;
  will-change: background, box-shadow;
  contain: layout style;
  
  // 仅在支持的浏览器中启用模糊效果
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
  
  &.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    @supports (backdrop-filter: blur(10px)) {
      background: rgba(255, 255, 255, 0.9);
    }
  }
}

.navbar-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  
  @media (max-width: 968px) {
    padding: 0 20px;
  }
}

// Logo 品牌
.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.brand-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// 导航菜单
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  
  .menu-icon {
    width: 18px;
    height: 18px;
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    
    .menu-icon {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    }
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    color: #667eea;
    font-weight: 600;
    
    .menu-icon {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 16px;
      right: 16px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px 3px 0 0;
    }
  }
}

// 右侧操作区
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  .action-icon {
    width: 20px;
    height: 20px;
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    
    .action-icon {
      opacity: 1;
    }
  }
}

.notification-btn {
  .notification-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
  }
}

// 用户菜单
.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(102, 126, 234, 0.2);
  
  &.is-default-avatar {
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    opacity: 0.8;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
    line-height: 1.2;
  }
  
  .user-role {
    font-size: 12px;
    color: #718096;
    line-height: 1.2;
  }
}

.chevron-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: transform 0.3s ease;
}

// 下拉菜单 - 性能优化版
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1001;
  
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  
  &.is-default-avatar {
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    opacity: 0.8;
  }
}

.dropdown-user-info {
  flex: 1;
  
  .dropdown-name {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 2px;
  }
  
  .dropdown-email {
    font-size: 13px;
    color: #718096;
  }
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 8px 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .item-icon {
    width: 18px;
    height: 18px;
    opacity: 0.6;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    
    .item-icon {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    }
  }
  
  &.danger {
    &:hover {
      background: rgba(245, 87, 108, 0.1);
      color: #f5576c;
      
      .item-icon {
        filter: brightness(0) saturate(100%) invert(56%) sepia(82%) saturate(2571%) hue-rotate(323deg) brightness(98%) contrast(92%);
      }
    }
  }
}

// 搜索面板 - 性能优化版
.search-panel {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px 0;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 32px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #fff;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.search-icon {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #2d3748;
  
  &::placeholder {
    color: #a0aec0;
  }
}

.search-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .close-icon {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

// 移动端按钮
.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  
  .menu-icon {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 968px) {
    display: flex;
  }
}

// 移动端菜单 - 性能优化版
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 85%;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  
  &.is-default-avatar {
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
  }
}

.mobile-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.mobile-role {
  font-size: 13px;
  color: #718096;
}

.close-mobile-menu {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  
  .close-icon {
    width: 20px;
    height: 20px;
  }
}

.mobile-nav {
  flex: 1;
  padding: 16px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.3s ease;
  
  .nav-icon {
    width: 20px;
    height: 20px;
    opacity: 0.6;
  }
  
  &:hover, &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    color: #667eea;
    
    .nav-icon {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    }
  }
}

.mobile-menu-footer {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: none;
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.1) 0%, rgba(245, 87, 108, 0.15) 100%);
  border-radius: 12px;
  color: #f5576c;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .logout-icon {
    width: 18px;
    height: 18px;
    filter: brightness(0) saturate(100%) invert(56%) sepia(82%) saturate(2571%) hue-rotate(323deg) brightness(98%) contrast(92%);
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(245, 87, 108, 0.25) 100%);
  }
}

// 主内容区 - 性能优化版
.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 32px 0;
  contain: layout style;
  
  @media (max-width: 968px) {
    padding: 24px 0;
  }
}

.content-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 32px;
  
  @media (max-width: 968px) {
    padding: 0 20px;
  }
}

// 页脚 - 性能优化版
.layout-footer {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px 0;
  
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  
  p {
    font-size: 14px;
    color: #718096;
    margin: 0;
  }
  
  @media (max-width: 968px) {
    padding: 0 20px;
    flex-direction: column;
    text-align: center;
  }
}

.footer-links {
  display: flex;
  gap: 24px;
  
  a {
    font-size: 14px;
    color: #718096;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #667eea;
    }
  }
}

// 遮罩层
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

// 动画
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式隐藏
@media (max-width: 968px) {
  .navbar-menu {
    display: none;
  }
}
</style>

