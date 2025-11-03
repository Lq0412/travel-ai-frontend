<template>
  <div class="product-detail-page">
    <a-spin :spinning="loading">
      <div v-if="product" class="product-detail-container">
        <!-- 返回按钮 -->
        <div class="back-button">
          <a-button @click="goBack">
            <template #icon><ArrowLeftOutlined /></template>
            返回
          </a-button>
        </div>

        <!-- 商品详细信息 -->
        <div class="product-content">
          <!-- 左侧：商品图片 -->
          <div class="product-images">
            <div class="main-image">
              <img :src="currentImage || product.coverUrl || '/placeholder.svg'" :alt="product.name" />
            </div>
            <div v-if="imageList.length > 0" class="image-thumbnails">
              <div
                v-for="(img, index) in imageList"
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
              >
                <img :src="img" :alt="`${product.name} ${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- 右侧：商品信息 -->
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-category">
              <a-tag color="blue">{{ product.category || '未分类' }}</a-tag>
            </div>

            <div class="product-price-section">
              <div class="price">
                <span class="currency">¥</span>
                <span class="amount">{{ product.price?.toFixed(2) }}</span>
              </div>
              <div v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                原价：<span class="line-through">¥{{ product.originalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <div class="product-specs">
              <div class="spec-item">
                <span class="spec-label">库存：</span>
                <span class="spec-value" :class="{ 'stock-out': product.stock === 0 }">
                  {{ product.stock > 0 ? `${product.stock} 件` : '缺货' }}
                </span>
              </div>
              <div class="spec-item">
                <span class="spec-label">销量：</span>
                <span class="spec-value">{{ product.sales || 0 }} 件</span>
              </div>
            </div>

            <div class="product-description">
              <h3>商品描述</h3>
              <p>{{ product.description || '暂无商品描述' }}</p>
            </div>

            <!-- 规格参数 -->
            <div v-if="productSpecs && Object.keys(productSpecs).length > 0" class="product-specs-detail">
              <h3>规格参数</h3>
              <div class="specs-list">
                <div v-for="(value, key) in productSpecs" :key="key" class="spec-row">
                  <span class="spec-key">{{ key }}：</span>
                  <span class="spec-val">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- 服务保障 -->
            <div v-if="serviceGuarantee && serviceGuarantee.length > 0" class="service-guarantee">
              <h3>服务保障</h3>
              <div class="guarantee-list">
                <a-tag v-for="(item, index) in serviceGuarantee" :key="index" color="green">
                  {{ item }}
                </a-tag>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="product-actions">
              <div class="quantity-selector">
                <span class="label">数量：</span>
                <a-input-number v-model:value="quantity" :min="1" :max="product.stock || 9999" />
              </div>
              <div class="action-buttons">
                <a-button size="large" :disabled="product.stock === 0" @click="addToCart(product)">
                  <ShoppingCartOutlined /> 加入购物车
                </a-button>
                <a-button type="primary" size="large" :disabled="product.stock === 0" @click="buyNow">
                  立即购买
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部商品详情说明 -->
        <div class="product-detail-section">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="detail" tab="商品详情">
              <div class="detail-content">
                <p v-if="product.description">{{ product.description }}</p>
                <div v-else class="no-detail">暂无详情</div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="specs" tab="规格参数">
              <div class="detail-content">
                <div v-if="productSpecs && Object.keys(productSpecs).length > 0" class="specs-table">
                  <div v-for="(value, key) in productSpecs" :key="key" class="spec-row">
                    <div class="spec-key">{{ key }}</div>
                    <div class="spec-val">{{ value }}</div>
                  </div>
                </div>
                <div v-else class="no-detail">暂无规格参数</div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <a-empty description="商品不存在或已下架" />
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const product = ref<API.Product | null>(null)
const quantity = ref(1)
const selectedImageIndex = ref(0)
const activeTab = ref('detail')

// 商品图片列表
const imageList = computed(() => {
  if (!product.value?.images) return []
  try {
    const parsed = JSON.parse(product.value.images)
    if (Array.isArray(parsed)) {
      return [product.value.coverUrl, ...parsed].filter(Boolean)
    }
  } catch (e) {
    // 如果不是JSON，返回封面图
  }
  return product.value.coverUrl ? [product.value.coverUrl] : []
})

// 当前显示的图片
const currentImage = computed(() => {
  if (imageList.value.length > 0 && selectedImageIndex.value >= 0 && selectedImageIndex.value < imageList.value.length) {
    return imageList.value[selectedImageIndex.value]
  }
  return product.value?.coverUrl
})

// 规格参数
const productSpecs = computed(() => {
  if (!product.value?.specs) return {}
  try {
    const parsed = JSON.parse(product.value.specs)
    return parsed || {}
  } catch (e) {
    return {}
  }
})

// 服务保障
const serviceGuarantee = computed(() => {
  if (!product.value?.serviceGuarantee) return []
  try {
    const parsed = JSON.parse(product.value.serviceGuarantee)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
})

// 获取商品详情
const loadProduct = async () => {
  const productId = Number(route.params.id)
  if (!productId) {
    message.error('商品ID无效')
    router.push('/user/shop')
    return
  }

  try {
    loading.value = true
    const res = await api.productController.getProductById({ id: productId })
    if (res.data?.code === 0 && res.data.data) {
      product.value = res.data.data
      // 设置默认图片
      if (product.value.coverUrl) {
        selectedImageIndex.value = 0
      }
    } else {
      message.error('商品不存在或已下架')
      setTimeout(() => {
        router.push('/user/shop')
      }, 2000)
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    message.error('获取商品详情失败')
    setTimeout(() => {
      router.push('/user/shop')
    }, 2000)
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 添加到购物车
const addToCart = async (productItem: API.Product) => {
  if (productItem.stock === 0) {
    message.warning('商品缺货，无法添加到购物车')
    return
  }

  try {
    const cartItem: API.Cart = {
      productId: productItem.id,
      merchantId: productItem.merchantId,
      quantity: quantity.value,
      specs: ''
    }
    const res = await api.cartController.addToCart(cartItem)
    if (res.data?.code === 0) {
      message.success('已添加到购物车')
    } else {
      message.error(res.data?.message || '添加到购物车失败')
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    message.error('添加到购物车失败')
  }
}

// 立即购买
const buyNow = () => {
  if (!product.value) return
  if (product.value.stock === 0) {
    message.warning('商品缺货，无法购买')
    return
  }

  // 先添加到购物车，然后跳转到订单页面
  addToCart(product.value).then(() => {
    router.push('/user/cart')
  })
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-bottom: 20px;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: #1890ff;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.product-category {
  margin: -10px 0 10px 0;
}

.product-price-section {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.price {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 20px;
  color: #e74c3c;
  font-weight: bold;
}

.amount {
  font-size: 36px;
  color: #e74c3c;
  font-weight: bold;
}

.original-price {
  color: #999;
  font-size: 14px;
}

.line-through {
  text-decoration: line-through;
}

.product-specs {
  display: flex;
  gap: 24px;
  padding: 16px 0;
}

.spec-item {
  display: flex;
  align-items: center;
}

.spec-label {
  color: #666;
  margin-right: 8px;
}

.spec-value {
  color: #333;
  font-weight: 500;
}

.spec-value.stock-out {
  color: #e74c3c;
}

.product-description h3,
.product-specs-detail h3,
.service-guarantee h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.product-description p {
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.product-specs-detail {
  margin-top: 20px;
}

.specs-list {
  display: grid;
  gap: 12px;
}

.specs-list .spec-row {
  display: flex;
  gap: 8px;
}

.specs-list .spec-key {
  color: #666;
  min-width: 100px;
}

.specs-list .spec-val {
  color: #333;
  flex: 1;
}

.service-guarantee {
  margin-top: 20px;
}

.guarantee-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-selector .label {
  color: #666;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .ant-btn {
  flex: 1;
  height: 50px;
  font-size: 16px;
}

.product-detail-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e8e8e8;
}

.detail-content {
  min-height: 200px;
  padding: 20px 0;
}

.specs-table {
  display: grid;
  gap: 0;
}

.specs-table .spec-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.specs-table .spec-row:last-child {
  border-bottom: none;
}

.specs-table .spec-row .spec-key {
  color: #666;
  font-weight: 500;
}

.specs-table .spec-row .spec-val {
  color: #333;
}

.no-detail {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .ant-btn {
    width: 100%;
  }
}
</style>

