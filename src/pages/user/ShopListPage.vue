<template>
  <div class="shop-list-page">
    <!-- 轮播图区域 -->
    <div
      class="carousel"
      @mouseenter="pauseCarousel"
      @mouseleave="resumeCarousel"
    >
      <div class="slides">
        <img
          src="https://huacheng.gz-cmc.com/upload/news/image/2023/04/18/48091c11a5be4ae5b32afe6cfbd96e2c.jpeg"
          alt="轮播图1"
          :class="{ active: currentSlide === 0 }"
          @click="nextSlide"
        >
        <img
          src="https://nfassetoss.southcn.com/__asset/0270e237b1/c2c895865a.jpeg"
          alt="轮播图2"
          :class="{ active: currentSlide === 1 }"
          @click="nextSlide"
        >
        <img
          src="https://th.bing.com/th/id/R.13d86556b56af56135efe5bf706311ad?rik=BOIBNZ10sZAH2g&riu=http%3a%2f%2fwww.conghua.gov.cn%2fimg%2f0%2f885%2f885156%2f8983883.jpg&ehk=IaSt6fTcJf9tDiOgei2UaRacoaDK3iGEanBRTee4%2fes%3d&risl=&pid=ImgRaw&r=0"
          alt="轮播图3"
          :class="{ active: currentSlide === 2 }"
          @click="nextSlide"
        >
      </div>

<!--      &lt;!&ndash; 指示器 &ndash;&gt;-->
<!--      <div class="carousel-indicators">-->
<!--        <span-->
<!--          v-for="index in 5"-->
<!--          :key="index"-->
<!--          :class="{ active: currentSlide === index - 1 }"-->
<!--          @click="goToSlide(index - 1)"-->
<!--        ></span>-->
<!--      </div>-->
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">商家名称</label>
          <a-input-search
            v-model:value="searchParams.name"
            placeholder="输入商家名称"
            enter-button="搜索"
            size="large"
            @search="handleSearch"
            allow-clear
          />
        </div>

        <div class="search-item">
          <label class="search-label">商家类型</label>
          <a-select
            v-model:value="searchParams.type"
            placeholder="选择商家类型"
            size="large"
            allow-clear
            @change="handleSearch"
            style="width: 100%"
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option :value="1">美食</a-select-option>
            <a-select-option :value="2">工艺品</a-select-option>
            <a-select-option :value="3">农产品</a-select-option>
            <a-select-option :value="4">酒店</a-select-option>
            <a-select-option :value="5">娱乐</a-select-option>
          </a-select>
        </div>

        <div class="search-item">
          <label class="search-label">所在位置</label>
          <a-input-search
            v-model:value="searchParams.location"
            placeholder="输入位置信息"
            enter-button="搜索"
            size="large"
            @search="handleSearch"
            allow-clear
          />
        </div>

        <div class="search-actions">
          <a-button @click="handleReset" size="large">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </div>
      </div>
    </div>

    <!-- 商家列表 -->
    <div class="shops-section">
      <div class="shops-header">
        <h2>推荐商家</h2>
        <span class="shop-count">共 {{ totalShops }} 家商家</span>
      </div>

      <div class="shops-grid" v-loading="loading">
        <div
          v-for="merchant in merchants"
          :key="merchant.id"
          class="merchant-card"
          @click="goToShop(merchant.id)"
        >
          <div class="merchant-image">
            <img
              :src="merchant.coverUrl || merchant.logoUrl || '/placeholder.svg'"
              :alt="merchant.name"
            />
          </div>

          <div class="merchant-info">
            <div class="merchant-header">
              <h3 class="merchant-name">{{ merchant.name }}</h3>
              <div class="merchant-logo">
                <img :src="merchant.logoUrl || '/placeholder.svg'" :alt="merchant.name" />
              </div>
            </div>

            <p class="merchant-location">{{ merchant.location }}</p>
            <p class="merchant-intro">{{ merchant.introduction }}</p>

            <div class="merchant-footer">
              <div class="merchant-type">
                <span class="type-badge">{{ getMerchantType(merchant.type) }}</span>
              </div>
              <a-button type="primary" @click.stop="goToShop(merchant.id)"> 进入店铺 </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && merchants.length === 0" class="empty-state">
        <ShopOutlined style="font-size: 64px; color: #ccc" />
        <h3>暂无商家</h3>
        <p>暂时没有可用的商家</p>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="totalShops > 0">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :page-size-options="['12', '24', '48']"
          :total="totalShops"
          show-size-changer
          show-quick-jumper
          :show-total="(total: number) => `共 ${total} 条`"
          @change="handleCurrentChange"
          @show-size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShopOutlined } from '@ant-design/icons-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const router = useRouter()

// 轮播图相关
const currentSlide = ref(0)
let carouselInterval: number | null = null

// 下一张
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3
}

// // 跳转到指定幻灯片
// const goToSlide = (index: number) => {
//   currentSlide.value = index
// }

// 暂停轮播
const pauseCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

// 恢复轮播
const resumeCarousel = () => {
  if (!carouselInterval) {
    startCarousel()
  }
}

// 开始轮播
const startCarousel = () => {
  carouselInterval = setInterval(nextSlide, 3500) // 2秒切换一次
}

// 响应式数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)

// 搜索参数
const searchParams = reactive({
  name: '',
  type: '',
  location: '',
})

const merchants = ref<API.Merchant[]>([])
const totalShops = ref(0)

// 获取商家列表
const loadMerchants = async () => {
  try {
    loading.value = true
    console.log('获取商家列表，搜索参数:', searchParams)

    // 构建查询参数，过滤空字符串
    const queryParams: API.MerchantQueryRequest = {
      current: currentPage.value,
      pageSize: pageSize.value,
    }

    // 只有非空值才添加到查询参数中
    if (searchParams.name && searchParams.name.trim()) {
      // 使用searchText进行模糊搜索，而不是精确的name匹配
      queryParams.searchText = searchParams.name.trim()
    }

    if (searchParams.type) {
      queryParams.type = Number(searchParams.type)
    }

    if (searchParams.location && searchParams.location.trim()) {
      // 注意：后端代码中没有处理location参数，需要后端添加
      queryParams.location = searchParams.location.trim()
    }

    console.log('查询参数:', queryParams)

    // 使用searchMerchants方法进行搜索
    const response = await api.merchantController.searchMerchants(queryParams)

    console.log('API响应:', response)

    if (response.data?.code === 0 && response.data.data) {
      merchants.value = response.data.data.records || []
      totalShops.value = response.data.data.total || 0
      console.log('获取到的商家数据:', merchants.value)
    } else {
      console.log('API返回错误:', response.data)
      message.warning('获取商家列表失败: ' + (response.data?.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取商家列表失败:', error)
    message.error('获取商家列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索功能
const handleSearch = () => {
  currentPage.value = 1
  loadMerchants()
}

// 重置搜索
const handleReset = () => {
  searchParams.name = ''
  searchParams.type = ''
  searchParams.location = ''
  currentPage.value = 1
  loadMerchants()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadMerchants()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadMerchants()
}

// 进入商家店铺
const goToShop = (merchantId?: number) => {
  if (merchantId) {
    router.push(`/user/shop/${merchantId}`)
  }
}

// 获取商家类型
const getMerchantType = (type?: number) => {
  const typeMap: Record<number, string> = {
    1: '餐厅',
    2: '酒店',
    3: '景点',
    4: '购物',
    5: '娱乐',
  }
  return typeMap[type || 0] || '其他'
}

// 组件挂载时加载数据
onMounted(() => {
  loadMerchants()
  startCarousel()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  pauseCarousel()
})
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.slides img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  cursor: pointer;
}

.slides img.active {
  opacity: 1;
}

/* 指示器样式 */
.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: #fff;
  transform: scale(1.2);
}

.carousel-indicators span:hover {
  background: rgba(255, 255, 255, 0.8);
}

.shop-list-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.header-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.search-row {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  flex: 1;
}

.search-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}

.search-actions .ant-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
}

.search-actions .ant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-item .ant-input-search {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-item .ant-input-search:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-item .ant-select {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-item .ant-select:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.shops-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.shops-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.shops-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.shop-count {
  color: #666;
  font-size: 0.9rem;
}

.shops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.merchant-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.merchant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.merchant-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.merchant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.merchant-card:hover .merchant-image img {
  transform: scale(1.05);
}

.merchant-info {
  padding: 1.5rem;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.merchant-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.merchant-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 1rem;
  flex-shrink: 0;
}

.merchant-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.merchant-location {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.merchant-intro {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.merchant-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-state h3 {
  margin: 1rem 0 0.5rem 0;
  color: #666;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-item {
    min-width: auto;
  }

  .search-actions {
    justify-content: center;
    margin-top: 1rem;
  }

  .shops-grid {
    grid-template-columns: 1fr;
  }

  .shops-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .merchant-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .merchant-logo {
    margin-left: 0;
  }

  .carousel {
    height: 150px;
  }

  .carousel-indicators span {
    width: 8px;
    height: 8px;
  }
}
</style>
