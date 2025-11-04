<template>
  <div class="home-container">
    <!-- Hero Section - 玻璃拟态风格 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      
      <div class="hero-content">
        <div class="glass-card hero-card">
          <div class="badge-chip">
            <img src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg" alt="sparkles" class="chip-icon">
            <span>AI 驱动的智能推荐</span>
          </div>
          
          <h1 class="hero-title">
            探索世界<br />
            <span class="gradient-text">从这里开始</span>
          </h1>
          
          <p class="hero-subtitle">
            让人工智能成为你的旅行顾问，为你量身定制独一无二的旅行体验
          </p>
          
          <div class="hero-actions">
            <button class="btn-primary" @click="handleExplore">
              <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="compass" class="btn-icon">
              <span>开始探索</span>
              <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="btn-arrow">
            </button>
            
            <button class="btn-secondary" @click="scrollToFeatures">
              <img src="https://unpkg.com/lucide-static@latest/icons/play-circle.svg" alt="play" class="btn-icon">
              <span>了解更多</span>
            </button>
          </div>
          
          <div class="hero-features">
            <div class="feature-item">
              <img src="https://unpkg.com/lucide-static@latest/icons/map-pin.svg" alt="map" class="feature-icon">
              <div>
                <div class="feature-number">10,000+</div>
                <div class="feature-label">全球景点</div>
              </div>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item">
              <img src="https://unpkg.com/lucide-static@latest/icons/users.svg" alt="users" class="feature-icon">
              <div>
                <div class="feature-number">50,000+</div>
                <div class="feature-label">活跃用户</div>
              </div>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item">
              <img src="https://unpkg.com/lucide-static@latest/icons/star.svg" alt="star" class="feature-icon">
              <div>
                <div class="feature-number">4.9/5.0</div>
                <div class="feature-label">用户评分</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 浮动装饰卡片 -->
        <div class="floating-cards">
          <div class="glass-card mini-card card-1">
            <img src="https://unpkg.com/lucide-static@latest/icons/plane.svg" alt="plane" class="card-icon">
            <div class="card-text">航班推荐</div>
          </div>
          <div class="glass-card mini-card card-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/hotel.svg" alt="hotel" class="card-icon">
            <div class="card-text">酒店预订</div>
          </div>
          <div class="glass-card mini-card card-3">
            <img src="https://unpkg.com/lucide-static@latest/icons/camera.svg" alt="camera" class="card-icon">
            <div class="card-text">景点打卡</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section - 核心功能 -->
    <section id="features" class="features-section">
      <div class="section-header">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">为您提供全方位的旅游服务体验</p>
      </div>
      
      <div class="features-grid">
        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-1">
            <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="compass" class="feature-icon-img">
          </div>
          <h3 class="feature-title">智能推荐</h3>
          <p class="feature-desc">基于 AI 算法为您推荐最适合的旅游景点和路线</p>
          <div class="feature-hover-effect"></div>
        </div>

        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-2">
            <img src="https://unpkg.com/lucide-static@latest/icons/bot.svg" alt="bot" class="feature-icon-img">
          </div>
          <h3 class="feature-title">AI 对话</h3>
          <p class="feature-desc">与智能助手实时对话，获取个性化旅游建议</p>
          <div class="feature-hover-effect"></div>
        </div>

        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-3">
            <img src="https://unpkg.com/lucide-static@latest/icons/map-pinned.svg" alt="map" class="feature-icon-img">
          </div>
          <h3 class="feature-title">景点探索</h3>
          <p class="feature-desc">海量景点信息，详细介绍和真实评价一手掌握</p>
          <div class="feature-hover-effect"></div>
        </div>

        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-4">
            <img src="https://unpkg.com/lucide-static@latest/icons/ticket.svg" alt="ticket" class="feature-icon-img">
          </div>
          <h3 class="feature-title">便捷购票</h3>
          <p class="feature-desc">在线预订景点门票，享受优惠价格和便捷服务</p>
          <div class="feature-hover-effect"></div>
        </div>

        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-5">
            <img src="https://unpkg.com/lucide-static@latest/icons/calendar-check.svg" alt="calendar" class="feature-icon-img">
          </div>
          <h3 class="feature-title">行程管理</h3>
          <p class="feature-desc">智能规划行程，跟踪旅行进度，让旅途井井有条</p>
          <div class="feature-hover-effect"></div>
        </div>

        <div class="glass-card feature-card">
          <div class="feature-icon-wrapper gradient-6">
            <img src="https://unpkg.com/lucide-static@latest/icons/users-round.svg" alt="users" class="feature-icon-img">
          </div>
          <h3 class="feature-title">社区分享</h3>
          <p class="feature-desc">分享旅游攻略，交流旅行心得，结识旅伴好友</p>
          <div class="feature-hover-effect"></div>
        </div>
      </div>
    </section>

    <!-- Roles Section - 多角色支持 -->
    <section id="roles" class="roles-section">
      <div class="section-header">
        <h2 class="section-title">多角色支持</h2>
        <p class="section-subtitle">不同角色，专属体验</p>
      </div>

      <div class="roles-grid">
        <!-- 普通用户 -->
        <div class="glass-card role-card">
          <div class="role-header">
            <div class="role-icon user-role">
              <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" alt="user">
            </div>
            <h3>普通用户</h3>
            <div class="role-badge">User</div>
          </div>
          <div class="role-desc">探索旅程，享受服务</div>
          <ul class="role-features">
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              论坛交流与留言墙
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              AI 智能助手推荐
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              浏览商家店铺
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              购物车与订单管理
            </li>
          </ul>
        </div>

        <!-- 商家 -->
        <div class="glass-card role-card">
          <div class="role-header">
            <div class="role-icon merchant-role">
              <img src="https://unpkg.com/lucide-static@latest/icons/store.svg" alt="store">
            </div>
            <h3>商家</h3>
            <div class="role-badge">Merchant</div>
          </div>
          <div class="role-desc">经营店铺，服务客户</div>
          <ul class="role-features">
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              商品上架与管理
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              订单处理与跟踪
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              商家设置与配置
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              论坛与 AI 助手
            </li>
          </ul>
        </div>

        <!-- 管理员 -->
        <div class="glass-card role-card">
          <div class="role-header">
            <div class="role-icon admin-role">
              <img src="https://unpkg.com/lucide-static@latest/icons/shield-check.svg" alt="admin">
            </div>
            <h3>管理员</h3>
            <div class="role-badge">Admin</div>
          </div>
          <div class="role-desc">平台管理，全局掌控</div>
          <ul class="role-features">
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              用户与商家管理
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              商品与订单查看
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              留言墙内容管理
            </li>
            <li>
              <img src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg" alt="check" class="check-icon">
              全部用户功能权限
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section - 行动召唤 -->
    <section class="cta-section">
      <div class="cta-background">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
      </div>
      <div class="cta-content">
        <div class="glass-card cta-card">
          <h2>准备好开始您的旅程了吗？</h2>
          <p>{{ loginUserStore.loginUser.id ? '进入控制台，开始您的旅程' : '立即注册，探索更多精彩内容' }}</p>
          <button class="btn-primary btn-large" @click="handleGetStarted">
            <img src="https://unpkg.com/lucide-static@latest/icons/rocket.svg" alt="rocket" class="btn-icon">
            <span>{{ loginUserStore.loginUser.id ? '进入控制台' : '立即开始' }}</span>
            <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="btn-arrow">
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 开始探索 - 如果已登录跳转仪表板，否则跳转登录
const handleExplore = () => {
  if (loginUserStore.loginUser.id) {
    router.push('/dashboard')
  } else {
    router.push('/user/login')
  }
}

// 立即开始（CTA按钮）
const handleGetStarted = () => {
  if (loginUserStore.loginUser.id) {
    handleExplore()
  } else {
    router.push('/user/register')
  }
}

// 滚动到功能区
const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: #f8f9fa;
}

// Hero Section - 玻璃拟态设计
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 20px;
  background: #0a0e27;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -15%;
  right: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  right: 20%;
  animation-delay: 14s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 30px) scale(0.9);
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

// 玻璃拟态卡片
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-card {
  padding: 60px;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
}

.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 32px;
  
  .chip-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }
}

.hero-title {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 42px;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #4facfe 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  img {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    
    &::before {
      opacity: 1;
    }
    
    .btn-arrow {
      transform: translateX(4px);
    }
  }
  
  span, img {
    position: relative;
    z-index: 1;
  }
  
  .btn-icon {
    filter: brightness(0) invert(1);
  }
  
  .btn-arrow {
    filter: brightness(0) invert(1);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .btn-icon {
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
}

// Hero Features
.hero-features {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 24px;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .feature-icon {
    width: 28px;
    height: 28px;
    filter: brightness(0) invert(1);
    opacity: 0.8;
  }
}

.feature-number {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.feature-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.feature-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    display: none;
  }
}

// 浮动装饰卡片
.floating-cards {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mini-card {
  position: absolute;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: float-mini 4s ease-in-out infinite;
  
  .card-icon {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
  
  .card-text {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
}

.card-1 {
  top: 15%;
  left: 5%;
  animation-delay: 0s;
}

.card-2 {
  top: 45%;
  right: 8%;
  animation-delay: 1.5s;
}

.card-3 {
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}

@keyframes float-mini {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

// Section Common Styles
.section-header {
  text-align: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
}

.section-title {
  font-size: 48px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 400;
}

// Features Section
.features-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    
    .feature-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }
    
    .feature-hover-effect {
      opacity: 1;
    }
  }
}

.feature-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.4s ease;
}

.feature-icon-img {
  width: 36px;
  height: 36px;
  filter: brightness(0) invert(1);
}

.gradient-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gradient-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-6 {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.feature-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.feature-hover-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

// Roles Section
.roles-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.role-card {
  padding: 40px 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.role-header {
  text-align: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-top: 16px;
    margin-bottom: 8px;
    color: #1a1a1a;
  }
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-desc {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
  padding: 0 16px;
}

.role-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  img {
    width: 36px;
    height: 36px;
    filter: brightness(0) invert(1);
  }
}

.role-card:hover .role-icon {
  transform: scale(1.1) rotate(10deg);
}

.user-role {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.merchant-role {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.admin-role {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.role-features {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 12px 0;
    font-size: 15px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
    
    .check-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      filter: brightness(0) saturate(100%) invert(65%) sepia(89%) saturate(420%) hue-rotate(74deg) brightness(94%) contrast(87%);
    }
  }
}

// CTA Section
.cta-section {
  position: relative;
  padding: 120px 20px;
  overflow: hidden;
  background: #0a0e27;
  
  @media (max-width: 768px) {
    padding: 80px 20px;
  }
}

.cta-background {
  position: absolute;
  inset: 0;
}

.cta-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.cta-orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -20%;
  left: -10%;
}

.cta-orb-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -20%;
  right: -10%;
}

.cta-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-card {
  padding: 60px 40px;
  
  @media (max-width: 768px) {
    padding: 40px 24px;
  }
  
  h2 {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 32px;
    }
  }
  
  p {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
    
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
}

.btn-large {
  padding: 18px 40px;
  font-size: 18px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}
</style>
