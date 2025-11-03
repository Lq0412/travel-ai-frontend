<template>
  <div class="checkout-page">
    <a-card>
      <div class="checkout-header">
        <h2>确认订单</h2>
        <a-button @click="router.back()">返回修改</a-button>
      </div>

      <a-divider />

      <!-- 收货信息 -->
      <div class="section">
        <h3>收货信息</h3>
        <a-form :model="form" layout="vertical">
          <a-form-item label="联系人姓名" name="contactName">
            <a-input v-model:value="form.contactName" placeholder="请输入联系人姓名" />
          </a-form-item>
          <a-form-item label="联系电话" name="contactPhone">
            <a-input v-model:value="form.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
          <a-form-item label="配送地址" name="shippingAddress">
            <a-input v-model:value="form.shippingAddress" placeholder="请输入配送地址" />
          </a-form-item>
        </a-form>
      </div>

      <a-divider />

      <!-- 商品列表 -->
      <div class="section">
        <h3>商品清单</h3>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.product?.coverUrl || '/placeholder.svg'" :alt="item.product?.name" class="item-image" />
            <div class="item-info">
              <h4>{{ item.product?.name }}</h4>
              <p class="item-category">{{ item.product?.category }}</p>
            </div>
            <div class="item-price">¥{{ item.product?.price?.toFixed(2) }}</div>
            <div class="item-quantity">x{{ item.quantity }}</div>
            <div class="item-subtotal">¥{{ item.subtotal?.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <a-divider />

      <!-- 金额统计 -->
      <div class="section">
        <div class="price-summary">
          <div class="summary-row">
            <span>商品总计：</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>优惠金额：</span>
            <span>-¥{{ discountAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>应付总额：</span>
            <span class="total-price">¥{{ actualAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <a-divider />

      <!-- 提交订单 -->
      <div class="checkout-footer">
        <div class="footer-info">
          <span>共 {{ cartItems.length }} 件商品，合计：</span>
          <span class="footer-total">¥{{ actualAmount.toFixed(2) }}</span>
        </div>
        <a-button type="primary" size="large" :loading="submitting" @click="submitOrder">
          提交订单
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '@/api'

const router = useRouter()

const cartItems = ref<API.CartVO[]>([])
const submitting = ref(false)

const form = ref({
  contactName: '',
  contactPhone: '',
  shippingAddress: ''
})

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum: number, item: API.CartVO) => {
    return sum + (item.subtotal || 0)
  }, 0)
})

const discountAmount = computed(() => {
  // 暂时没有优惠逻辑，返回0
  return 0
})

const actualAmount = computed(() => {
  return totalAmount.value - discountAmount.value
})

// 获取购物车数据
const loadCart = async () => {
  try {
    const res = await api.cartController.getCartList()
    if (res.data?.code === 0 && res.data.data) {
      cartItems.value = res.data.data
      if (cartItems.value.length === 0) {
        message.warning('购物车是空的')
        router.push('/user/cart')
      }
    } else {
      message.error(res.data?.message || '获取购物车失败')
      router.push('/user/cart')
    }
  } catch (error) {
    console.error('获取购物车失败:', error)
    message.error('获取购物车失败')
    router.push('/user/cart')
  }
}

// 提交订单
const submitOrder = async () => {
  if (cartItems.value.length === 0) {
    message.warning('购物车是空的')
    return
  }

  // 校验必填信息
  if (!form.value.contactName || !form.value.contactPhone) {
    message.warning('请填写联系人和联系电话')
    return
  }

  try {
    submitting.value = true

    // 获取商家ID（购物车中所有商品应该是同一商家）
    const merchantId = cartItems.value[0]?.merchantId
    if (!merchantId) {
      message.error('无法获取商家信息')
      return
    }

    // 构建订单商品列表
    const orderItems = cartItems.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product?.price,
      specs: item.specs
    }))

    // 创建订单
    const body: API.CreateOrderRequest = {
      merchantId: merchantId,
      contactName: form.value.contactName,
      contactPhone: form.value.contactPhone,
      shippingAddress: form.value.shippingAddress,
      items: orderItems
    }

    const res = await api.orderController.createOrder(body)
    if (res.data?.code === 0 && res.data.data) {
      message.success('订单创建成功')

      // 清空购物车
      await api.cartController.clearCart()

      // 跳转到订单列表
      router.push('/user/orders')
    } else {
      message.error(res.data?.message || '创建订单失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    message.error('创建订单失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkout-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.section {
  margin-bottom: 24px;
}

.section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 2fr 1fr 80px 1fr;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.item-category {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.item-price,
.item-quantity,
.item-subtotal {
  text-align: center;
  font-weight: 500;
}

.item-subtotal {
  color: #e74c3c;
  font-weight: bold;
}

.price-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.summary-row.total {
  font-size: 18px;
  font-weight: bold;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.total-price {
  color: #e74c3c;
  font-size: 24px;
}

.checkout-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.footer-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 16px;
}

.footer-total {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}

.checkout-footer .ant-btn {
  height: 50px;
  font-size: 16px;
  padding: 0 40px;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .item-price,
  .item-quantity,
  .item-subtotal {
    text-align: left;
  }

  .checkout-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>

