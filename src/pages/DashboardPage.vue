<template>
  <div class="dashboard-page">
    <!-- 欢迎卡片 - 简化版 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h1 class="welcome-title">
          {{ getGreeting() }}，{{ loginUserStore.loginUser.userName || '用户' }}
        </h1>
        <p class="welcome-subtitle">{{ getRoleWelcomeText() }}</p>
      </div>
      <div class="welcome-stats">
        <div 
          v-for="(stat, index) in topStats" 
          :key="index" 
          class="mini-stat"
        >
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
    
    <!-- 核心推荐内容 - 精美卡片 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <img :src="getSectionIcon()" alt="icon" class="header-icon">
          {{ getSectionTitle() }}
        </h2>
        <a href="#" class="view-all" @click.prevent="handleViewAll">
          查看全部
          <img src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" alt="arrow" class="arrow-icon">
        </a>
      </div>
      
      <div class="featured-grid">
        <div 
          v-for="(item, index) in featuredItems" 
          :key="index" 
          class="featured-card glass-card"
          @click="handleCardClick(item)"
        >
          <div class="featured-image">
            <img 
              :src="item.image" 
              :alt="item.title" 
              class="card-image"
              loading="lazy"
              decoding="async"
            >
            <div class="image-overlay">
              <div class="overlay-tag" :class="`tag-${item.tagType}`">{{ item.tag }}</div>
            </div>
          </div>
          <div class="featured-content">
            <h3 class="featured-title">{{ item.title }}</h3>
            <p class="featured-desc">{{ item.description }}</p>
            <div class="featured-meta">
              <span class="meta-item" v-if="item.meta1">
                <img :src="item.meta1Icon" alt="icon" class="meta-icon">
                {{ item.meta1 }}
              </span>
              <span class="meta-item" v-if="item.meta2">
                <img :src="item.meta2Icon" alt="icon" class="meta-icon">
                {{ item.meta2 }}
              </span>
            </div>
            <button class="action-button">
              <span>{{ item.actionText }}</span>
              <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="btn-arrow">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 获取问候语
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

// 获取角色欢迎文本
const getRoleWelcomeText = () => {
  const role = loginUserStore.loginUser.userRole
  const texts = {
    'admin': '平台运行稳定，今日新增用户 125 人',
    'merchant': '您有 8 个待处理订单，5 条新评价',
    'user': '为您精选了 6 个热门旅游目的地'
  }
  return texts[role as keyof typeof texts] || texts['user']
}

// 顶部核心统计（只保留3个最重要的）
const topStats = computed(() => {
  const role = loginUserStore.loginUser.userRole
  
  if (role === 'admin') {
    return [
      { value: '12.5K', label: '总用户' },
      { value: '1.2K', label: '活跃商家' },
      { value: '¥234K', label: '月收入' },
    ]
  } else if (role === 'merchant') {
    return [
      { value: '25', label: '今日订单' },
      { value: '¥3.2K', label: '今日收入' },
      { value: '4.8', label: '店铺评分' },
    ]
  } else {
    return [
      { value: '12', label: '收藏' },
      { value: '5', label: '行程' },
      { value: '8', label: '消息' },
    ]
  }
})

// 获取区块标题
const getSectionTitle = () => {
  const role = loginUserStore.loginUser.userRole
  const titles = {
    'admin': '平台数据概览',
    'merchant': '热门商品',
    'user': '为您推荐'
  }
  return titles[role as keyof typeof titles] || titles['user']
}

// 获取区块图标
const getSectionIcon = () => {
  const role = loginUserStore.loginUser.userRole
  const icons = {
    'admin': 'https://unpkg.com/lucide-static@latest/icons/trending-up.svg',
    'merchant': 'https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg',
    'user': 'https://unpkg.com/lucide-static@latest/icons/sparkles.svg'
  }
  return icons[role as keyof typeof icons] || icons['user']
}

// 核心展示内容（所有角色都用精美卡片）
const featuredItems = computed(() => {
  const role = loginUserStore.loginUser.userRole
  
  if (role === 'admin') {
    return [
      {
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
        title: '用户增长分析',
        description: '本月新增用户 3,245 人，环比增长 18.5%',
        tag: '增长中',
        tagType: 'success',
        meta1: '3.2K',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/users.svg',
        meta2: '+18.5%',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/trending-up.svg',
        actionText: '查看详情',
        path: '/admin/userManage'
      },
      {
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        title: '商家活跃度',
        description: '活跃商家 1,247 家，月订单量 8.5K',
        tag: '热门',
        tagType: 'hot',
        meta1: '1.2K',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/store.svg',
        meta2: '8.5K 单',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/shopping-cart.svg',
        actionText: '查看详情',
        path: '/admin/merchantManage'
      },
      {
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
        title: '商品销售额',
        description: '平台总商品 8,342 件，月销售额 ¥234K',
        tag: '收入',
        tagType: 'info',
        meta1: '8.3K',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/package.svg',
        meta2: '¥234K',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/dollar-sign.svg',
        actionText: '查看详情',
        path: '/admin/productManage'
      },
      {
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
        title: '留言墙管理',
        description: '用户留言 2,456 条，待审核 23 条',
        tag: '待处理',
        tagType: 'warning',
        meta1: '2.4K',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/message-circle.svg',
        meta2: '23 待审',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/alert-circle.svg',
        actionText: '去处理',
        path: '/admin/message-wall'
      },
      {
        image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&h=400&fit=crop',
        title: '论坛动态',
        description: '今日新帖 156 条，热门话题 12 个',
        tag: '活跃',
        tagType: 'success',
        meta1: '156',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/file-text.svg',
        meta2: '12 热门',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/flame.svg',
        actionText: '查看论坛',
        path: '/user/forum'
      },
      {
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        title: '系统设置',
        description: '配置平台参数，管理系统功能',
        tag: '管理',
        tagType: 'info',
        meta1: '全部功能',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/settings.svg',
        meta2: '正常运行',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/check-circle.svg',
        actionText: '进入设置',
        path: '/admin/settings'
      },
    ]
  } else if (role === 'merchant') {
    return [
      {
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop',
        title: '九寨沟门票套餐',
        description: '含景区大门票 + 观光车，限时特惠中',
        tag: '热销',
        tagType: 'hot',
        meta1: '¥280',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '4.9分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
      {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        title: '黄山旅游套票',
        description: '包含缆车往返 + 景区门票，爆款商品',
        tag: '爆款',
        tagType: 'success',
        meta1: '¥350',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '4.8分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        title: '张家界玻璃栈道',
        description: '体验惊险刺激的玻璃栈道，含保险',
        tag: '新品',
        tagType: 'info',
        meta1: '¥180',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '4.7分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
      {
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop',
        title: '桂林漓江游船',
        description: '豪华游船游览漓江，含午餐',
        tag: '推荐',
        tagType: 'success',
        meta1: '¥420',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '5.0分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
      {
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
        title: '三亚海滨度假',
        description: '五星酒店住宿 + 海滩娱乐项目',
        tag: '度假',
        tagType: 'info',
        meta1: '¥1280',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '4.9分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
      {
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop',
        title: '西藏布达拉宫',
        description: '含门票预约 + 专业导游讲解',
        tag: '精品',
        tagType: 'hot',
        meta1: '¥680',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/tag.svg',
        meta2: '4.8分',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        actionText: '查看详情',
        path: '/merchant/products'
      },
    ]
  } else {
    return [
      {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        title: '九寨沟风景区',
        description: '世界自然遗产，人间仙境般的美景',
        tag: '热门',
        tagType: 'hot',
        meta1: '4.8',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '四川阿坝',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        title: '张家界国家森林公园',
        description: '阿凡达取景地，奇峰异石的自然奇观',
        tag: 'AI 推荐',
        tagType: 'success',
        meta1: '4.9',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '湖南张家界',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
      {
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop',
        title: '桂林漓江',
        description: '山水甲天下，诗画般的美丽风光',
        tag: '特惠',
        tagType: 'info',
        meta1: '4.7',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '广西桂林',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
      {
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
        title: '三亚亚龙湾',
        description: '中国最美海湾，碧海蓝天白沙滩',
        tag: '度假',
        tagType: 'info',
        meta1: '4.8',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '海南三亚',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
      {
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop',
        title: '黄山风景区',
        description: '奇松怪石云海温泉，天下第一奇山',
        tag: '经典',
        tagType: 'success',
        meta1: '4.9',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '安徽黄山',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
      {
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop',
        title: '西藏布达拉宫',
        description: '世界屋脊的明珠，藏传佛教圣地',
        tag: '精品',
        tagType: 'hot',
        meta1: '5.0',
        meta1Icon: 'https://unpkg.com/lucide-static@latest/icons/star.svg',
        meta2: '西藏拉萨',
        meta2Icon: 'https://unpkg.com/lucide-static@latest/icons/map-pin.svg',
        actionText: '立即预订',
        path: '/user/shop'
      },
    ]
  }
})

// 查看全部
const handleViewAll = () => {
  const role = loginUserStore.loginUser.userRole
  if (role === 'admin') {
    router.push('/admin/userManage')
  } else if (role === 'merchant') {
    router.push('/merchant/products')
  } else {
    router.push('/user/shop')
  }
}

// 卡片点击
const handleCardClick = (item: any) => {
  if (item.path) {
    router.push(item.path)
  } else {
    message.info('功能开发中...')
  }
}
</script>

<style scoped lang="scss">
.dashboard-page {
  width: 100%;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 玻璃拟态卡片 - 性能优化版
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  
  // 仅在支持的浏览器中启用模糊效果
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
}

// 欢迎横幅 - 简化版（性能优化）
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 48px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 24px;
  margin-bottom: 40px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  contain: layout style paint;
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding: 32px 24px;
    text-align: center;
  }
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
}

.welcome-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.welcome-stats {
  display: flex;
  gap: 48px;
  
  @media (max-width: 968px) {
    gap: 32px;
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-around;
    gap: 16px;
  }
}

.mini-stat {
  text-align: center;
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: #718096;
  }
}

// Section
.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  
  .header-icon {
    width: 28px;
    height: 28px;
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
  }
}

.view-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
  
  .arrow-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    gap: 10px;
    
    .arrow-icon {
      transform: translateX(4px);
    }
  }
}

// 精美卡片网格 - 性能优化版
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  contain: layout;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.featured-card {
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  contain: layout style paint;
  
  &:hover {
    transform: translate3d(0, -8px, 0);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    
    .card-image {
      transform: translate3d(0, 0, 0) scale(1.08);
    }
    
    .image-overlay {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);
    }
    
    .action-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      
      .btn-arrow {
        filter: brightness(0) invert(1);
        transform: translate3d(4px, 0, 0);
      }
    }
  }
}

.featured-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
  transition: background 0.3s ease;
  will-change: background;
}

.overlay-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &.tag-hot {
    background: linear-gradient(135deg, rgba(245, 87, 108, 0.95) 0%, rgba(240, 147, 251, 0.95) 100%);
  }
  
  &.tag-success {
    background: linear-gradient(135deg, rgba(67, 233, 123, 0.95) 0%, rgba(56, 249, 215, 0.95) 100%);
  }
  
  &.tag-info {
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.95) 0%, rgba(0, 242, 254, 0.95) 100%);
  }
  
  &.tag-warning {
    background: linear-gradient(135deg, rgba(250, 112, 154, 0.95) 0%, rgba(254, 225, 64, 0.95) 100%);
  }
}

.featured-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.featured-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.4;
}

.featured-desc {
  font-size: 14px;
  color: #718096;
  margin-bottom: 16px;
  line-height: 1.6;
  flex: 1;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4a5568;
  font-weight: 500;
  
  .meta-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
}

.action-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  will-change: background, color;
  
  .btn-arrow {
    width: 16px;
    height: 16px;
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
    transition: transform 0.3s ease, filter 0.3s ease;
    will-change: transform;
  }
}
</style>
