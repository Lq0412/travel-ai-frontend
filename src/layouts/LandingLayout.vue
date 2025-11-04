<template>
  <div class="landing-layout">
    <!-- 固定顶部导航 -->
    <header class="landing-header" :class="{ 'scrolled': isScrolled }">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo">
          <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="logo" class="logo-icon">
          <span class="logo-text">AI 旅游</span>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <a href="#features" class="nav-link">功能特色</a>
          <a href="#roles" class="nav-link">角色支持</a>
          <a @click="scrollToSection('features')" class="nav-link">了解更多</a>
        </nav>
        
        <!-- 右侧按钮 -->
        <div class="header-actions">
          <!-- 未登录状态 -->
          <template v-if="!loginUserStore.loginUser.id">
            <button @click="handleLogin" class="btn-login">
              <img src="https://unpkg.com/lucide-static@latest/icons/log-in.svg" alt="login" class="btn-icon-small">
              登录
            </button>
            <button @click="handleRegister" class="btn-register">
              <img src="https://unpkg.com/lucide-static@latest/icons/user-plus.svg" alt="register" class="btn-icon-small">
              注册
            </button>
          </template>
          
          <!-- 已登录状态 -->
          <template v-else>
            <div class="user-info-wrapper">
              <button @click="goToDashboard" class="btn-dashboard">
                <img src="https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg" alt="dashboard" class="btn-icon-small">
                控制台
              </button>
              <div class="user-dropdown">
                <button class="user-trigger">
                  <img 
                    :src="loginUserStore.loginUser.userAvatar || 'https://unpkg.com/lucide-static@latest/icons/user-circle.svg'" 
                    alt="avatar" 
                    class="user-avatar"
                    :class="{ 'is-default-avatar': !loginUserStore.loginUser.userAvatar }"
                  >
                  <span class="user-name">{{ loginUserStore.loginUser.userName || '用户' }}</span>
                  <img src="https://unpkg.com/lucide-static@latest/icons/chevron-down.svg" alt="down" class="chevron-icon">
                </button>
                <div class="dropdown-menu">
                  <button class="dropdown-item" @click="goToDashboard">
                    <img src="https://unpkg.com/lucide-static@latest/icons/layout-dashboard.svg" alt="dashboard" class="item-icon">
                    <span>控制台</span>
                  </button>
                  <button class="dropdown-item danger" @click="handleLogout">
                    <img src="https://unpkg.com/lucide-static@latest/icons/log-out.svg" alt="logout" class="item-icon">
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <img src="https://unpkg.com/lucide-static@latest/icons/menu.svg" alt="menu" class="menu-icon">
        </button>
      </div>
    </header>
    
    <!-- 移动端菜单 -->
    <transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-menu">
        <a href="#features" class="mobile-nav-link" @click="closeMobileMenu">功能特色</a>
        <a href="#roles" class="mobile-nav-link" @click="closeMobileMenu">角色支持</a>
        <a @click="scrollToSection('features'); closeMobileMenu()" class="mobile-nav-link">了解更多</a>
        
        <!-- 未登录状态 -->
        <div v-if="!loginUserStore.loginUser.id" class="mobile-actions">
          <button @click="handleLogin" class="btn-mobile-login">登录</button>
          <button @click="handleRegister" class="btn-mobile-register">注册</button>
        </div>
        
        <!-- 已登录状态 -->
        <div v-else class="mobile-user-section">
          <div class="mobile-user-info">
            <img 
              :src="loginUserStore.loginUser.userAvatar || 'https://unpkg.com/lucide-static@latest/icons/user-circle.svg'" 
              alt="avatar" 
              class="mobile-avatar"
              :class="{ 'is-default-avatar': !loginUserStore.loginUser.userAvatar }"
            >
            <span class="mobile-username">{{ loginUserStore.loginUser.userName || '用户' }}</span>
          </div>
          <div class="mobile-actions">
            <button @click="goToDashboard" class="btn-mobile-dashboard">控制台</button>
            <button @click="handleLogout" class="btn-mobile-logout">退出</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 页面内容 -->
    <main class="landing-main">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="logo" class="footer-logo-icon">
              <span class="footer-logo-text">AI 旅游推荐平台</span>
            </div>
            <p class="footer-desc">让 AI 成为你的专属旅行顾问</p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">产品</h4>
            <a href="#" class="footer-link">功能特色</a>
            <a href="#" class="footer-link">价格方案</a>
            <a href="#" class="footer-link">更新日志</a>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">支持</h4>
            <a href="#" class="footer-link">帮助中心</a>
            <a href="#" class="footer-link">联系我们</a>
            <a href="#" class="footer-link">隐私政策</a>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">社区</h4>
            <a href="#" class="footer-link">用户论坛</a>
            <a href="#" class="footer-link">开发者文档</a>
            <a href="#" class="footer-link">博客</a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 AI 旅游推荐平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogout } from '@/api/userController'
import { message } from 'ant-design-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()
const isScrolled = ref(false)
const showMobileMenu = ref(false)

// 处理滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 导航到登录/注册页
const handleLogin = () => {
  router.push('/user/login')
}

const handleRegister = () => {
  router.push('/user/register')
}

// 处理退出登录
const handleLogout = async () => {
  try {
    const res = await userLogout()
    if (res.data.code === 0) {
      loginUserStore.setLoginUser({ userName: '未登录' })
      message.success('退出登录成功')
      closeMobileMenu()
      // 刷新当前页面以更新UI
      window.location.reload()
    } else {
      message.error('退出登录失败，' + res.data.message)
    }
  } catch (error) {
    message.error('退出登录失败')
  }
}

// 跳转到仪表板
const goToDashboard = () => {
  router.push('/dashboard')
  closeMobileMenu()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 获取登录用户信息
  loginUserStore.fetchLoginUser()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.landing-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Header
.landing-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.3s ease;
  
  &.scrolled {
    background: rgba(10, 14, 39, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 12px 0;
  }
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    filter: brightness(0) invert(1);
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: 968px) {
    display: none;
  }
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 968px) {
    display: none;
  }
}

.btn-login,
.btn-register {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .btn-icon-small {
    width: 16px;
    height: 16px;
  }
}

.btn-login {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .btn-icon-small {
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  
  .btn-icon-small {
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
}

// 用户信息区域
.user-info-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-dashboard {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .btn-icon-small {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

// 用户下拉菜单
.user-dropdown {
  position: relative;
  
  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  
  &.is-default-avatar {
    filter: brightness(0) invert(1);
    opacity: 0.8;
  }
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
  opacity: 0.7;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .chevron-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .item-icon {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
    opacity: 0.7;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    .item-icon {
      opacity: 1;
    }
  }
  
  &.danger {
    &:hover {
      background: rgba(245, 87, 108, 0.2);
      color: #f5576c;
      
      .item-icon {
        filter: brightness(0) saturate(100%) invert(56%) sepia(82%) saturate(2571%) hue-rotate(323deg) brightness(98%) contrast(92%);
      }
    }
  }
}

// Mobile Menu Button
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  
  .menu-icon {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
  
  @media (max-width: 968px) {
    display: block;
  }
}

// Mobile Menu
.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(10, 14, 39, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 20px;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.mobile-nav-link {
  display: block;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.mobile-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  
  button {
    flex: 1;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
}

.btn-mobile-login {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.btn-mobile-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-mobile-dashboard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-mobile-logout {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

// 移动端用户信息
.mobile-user-section {
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.mobile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  
  &.is-default-avatar {
    filter: brightness(0) invert(1);
    opacity: 0.8;
  }
}

.mobile-username {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

// Slide Down Animation
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// Main Content
.landing-main {
  flex: 1;
  width: 100%;
}

// Footer
.landing-footer {
  background: #0a0e27;
  padding: 60px 0 30px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 40px;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  .footer-logo-icon {
    width: 28px;
    height: 28px;
    filter: brightness(0) invert(1);
  }
  
  .footer-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }
}

.footer-desc {
  font-size: 14px;
  line-height: 1.6;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.footer-link {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>

