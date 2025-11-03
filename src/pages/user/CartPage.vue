<template>
  <div class="cart-page">
    <div class="cart-header">
      <h2>我的购物车</h2>
      <a-space>
        <a-button @click="loadCart">刷新</a-button>
        <a-button danger v-if="cartList.length > 0" @click="handleClearCart">清空购物车</a-button>
      </a-space>
    </div>

    <a-spin :spinning="loading">
      <!-- 购物车列表 -->
      <div class="cart-items" v-if="cartList.length > 0">
        <div v-for="item in cartList" :key="item.id" class="cart-item">
          <div class="item-info">
            <div class="item-image">
              <img :src="item.product?.coverUrl || '/placeholder.svg'" :alt="item.product?.name" @click="goToProductDetail(item.product?.id)" style="cursor: pointer;" />
            </div>
            <div class="item-details">
              <h3 class="item-name" @click="goToProductDetail(item.product?.id)" style="cursor: pointer;">{{ item.product?.name }}</h3>
              <p class="item-merchant">商家ID: {{ item.merchantId }}</p>
              <p class="item-category" v-if="item.product?.category">{{ item.product.category }}</p>
            </div>
          </div>

          <div class="item-price">¥{{ item.product?.price?.toFixed(2) }}</div>

          <div class="item-quantity">
            <a-input-number
              v-model:value="item.quantity"
              :min="1"
              :max="item.product?.stock || 9999"
              @change="handleQuantityChange(item)"
            />
          </div>

          <div class="item-subtotal">¥{{ item.subtotal?.toFixed(2) }}</div>

          <div class="item-actions">
            <a-popconfirm title="确认删除？" @confirm="handleDelete(item.id)">
              <a-button danger type="link" size="small">删除</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <ShoppingCartOutlined style="font-size: 64px; color: #ccc" />
        <h3>购物车是空的</h3>
        <p>快去选购心仪的商品吧</p>
        <a-button type="primary" @click="$router.push('/user/shop')">去购物</a-button>
      </div>

      <!-- 结算栏 -->
      <div class="cart-footer" v-if="cartList.length > 0">
        <div class="footer-total">
          <span class="total-label">合计：</span>
          <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <a-button type="primary" size="large" @click="handleCheckout">
          结算 ({{ cartList.length }})
        </a-button>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShoppingCartOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const router = useRouter()

const loading = ref(false)
const cartList = ref<API.CartVO[]>([])
const selectedCount = ref(0)

const totalAmount = computed(() => {
  return cartList.value.reduce((sum: number, item: API.CartVO) => {
    return sum + (item.subtotal || 0)
  }, 0)
})

const loadCart = async () => {
  try {
    loading.value = true
    const res = await api.cartController.getCartList()
    if (res.data?.code === 0 && res.data.data) {
      cartList.value = res.data.data
      console.log('购物车数据:', cartList.value)
    } else {
      message.error(res.data?.message || '获取购物车失败')
    }
  } catch (error) {
    console.error('获取购物车失败:', error)
    message.error('获取购物车失败')
  } finally {
    loading.value = false
  }
}

const handleQuantityChange = async (item: API.CartVO) => {
  try {
    const res = await api.cartController.updateCart(item)
    if (res.data?.code === 0) {
      // 重新计算小计
      if (item.product?.price && item.quantity) {
        item.subtotal = item.product.price * item.quantity
      }
    } else {
      message.error(res.data?.message || '更新失败')
      await loadCart()
    }
  } catch (error) {
    console.error('更新失败:', error)
    message.error('更新失败')
    await loadCart()
  }
}

const handleDelete = async (cartId?: number) => {
  if (!cartId) return
  try {
    const res = await api.cartController.deleteCart({ id: cartId })
    if (res.data?.code === 0) {
      message.success('删除成功')
      await loadCart()
    } else {
      message.error(res.data?.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

const handleClearCart = async () => {
  try {
    const res = await api.cartController.clearCart()
    if (res.data?.code === 0) {
      message.success('已清空购物车')
      await loadCart()
    } else {
      message.error(res.data?.message || '清空失败')
    }
  } catch (error) {
    console.error('清空失败:', error)
    message.error('清空失败')
  }
}

const handleCheckout = () => {
  if (cartList.value.length === 0) {
    message.warning('购物车是空的，无法结算')
    return
  }
  
  // 跳转到结算页面
  router.push('/user/checkout')
}

const goToProductDetail = (productId?: number) => {
  if (productId) {
    router.push(`/product/${productId}`)
  }
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cart-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 100px;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.item-merchant,
.item-category {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.item-price,
.item-subtotal {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e74c3c;
  text-align: center;
}

.item-quantity {
  display: flex;
  justify-content: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  margin-top: 2rem;
}

.footer-total {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.total-label {
  font-size: 1.2rem;
  color: #666;
}

.total-amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e74c3c;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  margin: 1rem 0 0.5rem 0;
  color: #666;
  font-size: 1.3rem;
}

.empty-state p {
  color: #999;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item-price,
  .item-subtotal,
  .item-quantity {
    text-align: left;
  }

  .cart-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>

