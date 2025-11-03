<template>
  <div class="shop-page">
    <!-- 页面头部 -->
    <div class="shop-header">
      <div class="header-content">
        <div class="shop-info" v-if="merchantInfo">
          <div class="shop-avatar">
            <img :src="merchantInfo.logoUrl || '/placeholder.svg'" :alt="merchantInfo.name" />
          </div>
          <div class="shop-details">
            <h1 class="shop-name">{{ merchantInfo.name }}</h1>
            <p class="shop-location">{{ merchantInfo.location }}</p>
            <p class="shop-intro">{{ merchantInfo.introduction }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="search-form">
        <div class="search-row">
          <div class="search-item">
            <label class="search-label">商品名称</label>
            <a-input-search
              v-model:value="searchParams.name"
              placeholder="输入商品名称"
              enter-button="搜索"
              size="large"
              @search="handleSearch"
              allow-clear
            />
          </div>

          <div class="search-item">
            <label class="search-label">商品分类</label>
            <a-select
              v-model:value="searchParams.category"
              placeholder="选择分类"
              size="large"
              allow-clear
              @change="handleSearch"
              style="width: 100%"
            >
              <a-select-option value="">全部分类</a-select-option>
              <a-select-option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </a-select-option>
            </a-select>
          </div>

          <div class="search-item">
            <label class="search-label">排序方式</label>
            <a-select
              v-model:value="searchParams.sortBy"
              placeholder="排序方式"
              size="large"
              @change="handleSearch"
              style="width: 100%"
            >
              <a-select-option value="default">默认排序</a-select-option>
              <a-select-option value="price_asc">价格从低到高</a-select-option>
              <a-select-option value="price_desc">价格从高到低</a-select-option>
              <a-select-option value="newest">最新上架</a-select-option>
            </a-select>
          </div>

          <div class="search-actions">
            <a-button @click="handleReset" size="large">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品展示区域 -->
    <div class="products-section">
      <div class="products-header">
        <h2>商品列表</h2>
        <span class="product-count">共 {{ totalProducts }} 件商品</span>
      </div>

      <a-spin :spinning="loading">
        <div class="products-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="goToProductDetail(product.id)"
          >
            <div class="product-image">
            <img :src="product.coverUrl || '/placeholder.svg'" :alt="product.name" />
            <div class="product-badge" v-if="product.stock === 0">
              <span>缺货</span>
            </div>
            <div class="product-actions">
              <a-button type="primary" size="small" @click.stop="addToCart(product)">
                <ShoppingCartOutlined />
              </a-button>
              <a-button type="default" size="small" @click.stop="toggleFavorite()">
                <StarOutlined />
              </a-button>
            </div>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <p class="product-description">{{ product.description }}</p>

            <div class="product-footer">
              <div class="product-price">
                <span class="price">¥{{ product.price?.toFixed(2) }}</span>
                <span class="stock" v-if="product.stock !== undefined">
                  库存: {{ product.stock }}
                </span>
              </div>
              <div class="product-actions-footer">
                <a-button type="default" size="small" :disabled="product.stock === 0" @click.stop="addToCart(product)">
                  <ShoppingCartOutlined /> 加入购物车
                </a-button>
                <a-button type="primary" size="small" :disabled="product.stock === 0" @click.stop="openBuyModal(product)">立即购买</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="products.length === 0" class="empty-state">
        <InboxOutlined style="font-size: 64px; color: #ccc;" />
        <h3>暂无商品</h3>
        <p>该商家暂时没有上架商品</p>
      </div>
      </a-spin>

      <!-- 分页 -->
      <div class="pagination-container" v-if="totalProducts > 0">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :page-size-options="['12', '24', '48', '96']"
        :total="totalProducts"
        show-size-changer
        show-quick-jumper
        :show-total="(total: number) => `共 ${total} 条`"
        @change="handleCurrentChange"
        @show-size-change="handleSizeChange"
      />
      </div>
    </div>
  </div>
  <a-modal v-model:open="buyModalOpen" title="确认购买" :confirm-loading="creatingOrder" @ok="submitOrder" @cancel="closeBuyModal">
    <div v-if="selectedProduct">
      <div style="margin-bottom: 12px; font-weight: 600">{{ selectedProduct.name }}</div>
      <div style="display: flex; gap: 12px; margin-bottom: 12px">
        <span>单价：¥{{ selectedProduct.price?.toFixed(2) }}</span>
        <span v-if="selectedProduct.stock !== undefined">库存：{{ selectedProduct.stock }}</span>
      </div>
      <div style="margin-bottom: 12px">
        <span style="margin-right: 8px">购买数量</span>
        <a-input-number v-model:value="buyQuantity" :min="1" :max="selectedProduct.stock || 9999" />
      </div>
      <a-input v-model:value="contactName" style="margin-bottom: 8px" placeholder="联系人姓名（可选）" />
      <a-input v-model:value="contactPhone" style="margin-bottom: 8px" placeholder="联系电话（可选）" />
      <a-input v-model:value="shippingAddress" placeholder="收货地址（可选）" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShoppingCartOutlined, StarOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)

// 搜索参数
const searchParams = reactive({
  name: '',
  category: '',
  sortBy: 'default'
})

const merchantInfo = ref<API.Merchant | null>(null)
const products = ref<API.Product[]>([])
const totalProducts = ref(0)
const categories = ref<string[]>([])

// 获取商家ID
const merchantId = computed(() => {
  return Number(route.params.id) || Number(route.query.merchantId)
})

// 获取商家信息
const loadMerchantInfo = async () => {
  if (!merchantId.value) return

  try {
    const response = await api.merchantController.getMerchantDetail({ merchantId: merchantId.value })
    if (response.data?.code === 0 && response.data.data) {
      merchantInfo.value = response.data.data
    }
  } catch (error) {
    console.error('获取商家信息失败:', error)
    message.error('获取商家信息失败')
  }
}

// 获取商品列表
const loadProducts = async () => {
  if (!merchantId.value) return

  try {
    loading.value = true
    console.log('获取商品列表，商家ID:', merchantId.value)
    console.log('搜索参数:', searchParams)

    // 构建查询参数，过滤空字符串
    const queryParams: API.MerchantQueryRequest = {
      current: currentPage.value,
      pageSize: pageSize.value
    }

    // 只有非空值才添加到查询参数中
    if (searchParams.name && searchParams.name.trim()) {
      queryParams.searchText = searchParams.name.trim()
      queryParams.name = searchParams.name.trim()
    }

    console.log('查询参数:', queryParams)

    const response = await api.merchantController.getMerchantProducts({
      merchantId: merchantId.value,
      queryRequest: queryParams
    })

    console.log('API响应:', response)

    if (response.data?.code === 0 && response.data.data) {
      let productList = response.data.data.records || []

      // 分类筛选
      if (searchParams.category) {
        productList = productList.filter(product => product.category === searchParams.category)
      }

      // 排序
      productList = sortProducts(productList)

      products.value = productList
      totalProducts.value = response.data.data.total || 0

      // 提取分类列表
      const categorySet = new Set<string>()
      productList.forEach(product => {
        if (product.category) {
          categorySet.add(product.category)
        }
      })
      categories.value = Array.from(categorySet)
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    message.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 商品排序
const sortProducts = (productList: API.Product[]) => {
  const sorted = [...productList]

  switch (searchParams.sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price_desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createTime || '').getTime() - new Date(a.createTime || '').getTime())
    default:
      return sorted
  }
}

// 搜索功能
const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置搜索
const handleReset = () => {
  searchParams.name = ''
  searchParams.category = ''
  searchParams.sortBy = 'default'
  currentPage.value = 1
  loadProducts()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadProducts()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadProducts()
}

// 商品详情
const goToProductDetail = (productId?: number) => {
  if (productId) {
    router.push(`/product/${productId}`)
  }
}

// 添加到购物车
const addToCart = async (product: API.Product) => {
  if (product.stock === 0) {
    message.warning('商品缺货，无法添加到购物车')
    return
  }

  try {
    const cartItem: API.Cart = {
      productId: product.id,
      merchantId: merchantId.value,
      quantity: 1,
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

// 收藏商品
const toggleFavorite = async () => {
  try {
    // 这里可以调用收藏API
    message.success('已收藏商品')
  } catch {
    message.error('收藏失败')
  }
}

const creatingOrder = ref(false)
const buyModalOpen = ref(false)
const selectedProduct = ref<API.Product | null>(null)
const buyQuantity = ref<number>(1)
const contactName = ref('')
const contactPhone = ref('')
const shippingAddress = ref('')

const openBuyModal = (product: API.Product) => {
  selectedProduct.value = product
  buyQuantity.value = 1
  buyModalOpen.value = true
}

const closeBuyModal = () => {
  buyModalOpen.value = false
  selectedProduct.value = null
}

const submitOrder = async () => {
  if (!merchantId.value || !selectedProduct.value) return
  if (!buyQuantity.value || buyQuantity.value <= 0) {
    message.warning('请填写正确的购买数量')
    return
  }
  if (selectedProduct.value.stock !== undefined && buyQuantity.value > (selectedProduct.value.stock || 0)) {
    message.warning('购买数量超过库存')
    return
  }
  try {
    creatingOrder.value = true
    const body: API.CreateOrderRequest = {
      merchantId: merchantId.value,
      contactName: contactName.value || undefined,
      contactPhone: contactPhone.value || undefined,
      shippingAddress: shippingAddress.value || undefined,
      items: [
        {
          productId: Number(selectedProduct.value.id),
          quantity: Number(buyQuantity.value),
          price: selectedProduct.value.price,
        },
      ],
    }
    const res = await api.orderController.createOrder(body)
    if (res.data?.code === 0 && res.data.data) {
      message.success('下单成功')
      buyModalOpen.value = false
      // 可跳转到订单列表
      router.push('/user/orders')
    } else {
      message.error('下单失败：' + (res.data?.message || '未知错误'))
    }
  } catch (e) {
    console.error(e)
    message.error('下单失败，请稍后重试')
  } finally {
    creatingOrder.value = false
  }
}

// 监听路由参数变化
watch(() => route.params.id, () => {
  if (merchantId.value) {
    loadMerchantInfo()
    loadProducts()
  }
}, { immediate: true })

// 组件挂载时加载数据
onMounted(() => {
  if (merchantId.value) {
    loadMerchantInfo()
    loadProducts()
  }
})
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.shop-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.shop-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.shop-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-details {
  flex: 1;
}

.shop-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.shop-location {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 0.5rem 0;
}

.shop-intro {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.5;
}

.search-section {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.search-form {
  max-width: 1200px;
  margin: 0 auto;
}

.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  flex: 1;
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

.products-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.products-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.product-count {
  color: #666;
  font-size: 0.9rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.product-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.product-category {
  color: #667eea;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-actions-footer {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e74c3c;
}

.stock {
  font-size: 0.8rem;
  color: #999;
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
  .shop-info {
    flex-direction: column;
    text-align: center;
  }

  .shop-name {
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

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .products-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
