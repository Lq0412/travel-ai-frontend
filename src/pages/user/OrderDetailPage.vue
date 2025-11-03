<template>
  <div class="order-detail-page">
    <a-card>
      <div class="detail-header">
        <a-button @click="router.back()">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
        <h2 class="order-title">订单详情</h2>
      </div>

      <a-spin :spinning="loading">
        <div v-if="orderDetail" class="order-content">
          <!-- 订单基本信息 -->
          <div class="info-section">
            <h3 class="section-title">订单信息</h3>
            <a-row :gutter="24">
              <a-col :span="12">
                <div class="info-item">
                  <span class="label">订单号：</span>
                  <span class="value">{{ orderDetail.orderNo }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="info-item">
                  <span class="label">订单状态：</span>
                  <a-tag :color="getStatusColor(orderDetail.status)">
                    {{ getStatusText(orderDetail.status) }}
                  </a-tag>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="info-item">
                  <span class="label">下单时间：</span>
                  <span class="value">{{ orderDetail.createTime }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="info-item">
                  <span class="label">商家ID：</span>
                  <span class="value">{{ orderDetail.merchantId }}</span>
                </div>
              </a-col>
            </a-row>
          </div>

          <!-- 收货信息 -->
          <div class="info-section" v-if="orderDetail.contactName || orderDetail.shippingAddress">
            <h3 class="section-title">收货信息</h3>
            <a-row :gutter="24">
              <a-col :span="12" v-if="orderDetail.contactName">
                <div class="info-item">
                  <span class="label">联系人：</span>
                  <span class="value">{{ orderDetail.contactName }}</span>
                </div>
              </a-col>
              <a-col :span="12" v-if="orderDetail.contactPhone">
                <div class="info-item">
                  <span class="label">联系电话：</span>
                  <span class="value">{{ orderDetail.contactPhone }}</span>
                </div>
              </a-col>
              <a-col :span="24" v-if="orderDetail.shippingAddress">
                <div class="info-item">
                  <span class="label">收货地址：</span>
                  <span class="value">{{ orderDetail.shippingAddress }}</span>
                </div>
              </a-col>
            </a-row>
          </div>

          <!-- 商品信息 -->
          <div class="info-section">
            <h3 class="section-title">商品信息</h3>
            <a-table
              :data-source="orderItems"
              :columns="itemColumns"
              row-key="id"
              :pagination="false"
              size="middle"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'productImage'">
                  <a-image :src="record.productImage" :width="60" />
                </template>
                <template v-else-if="column.key === 'price'">
                  ¥{{ (record.price ?? 0).toFixed(2) }}
                </template>
                <template v-else-if="column.key === 'totalPrice'">
                  ¥{{ (record.totalPrice ?? 0).toFixed(2) }}
                </template>
              </template>
            </a-table>
          </div>

          <!-- 费用明细 -->
          <div class="info-section">
            <h3 class="section-title">费用明细</h3>
            <div class="fee-details">
              <div class="fee-row">
                <span class="fee-label">商品总价：</span>
                <span class="fee-value">¥{{ (orderDetail.totalAmount ?? 0).toFixed(2) }}</span>
              </div>
              <div class="fee-row" v-if="orderDetail.discountAmount && orderDetail.discountAmount > 0">
                <span class="fee-label">优惠金额：</span>
                <span class="fee-value discount">-¥{{ (orderDetail.discountAmount ?? 0).toFixed(2) }}</span>
              </div>
              <div class="fee-row total">
                <span class="fee-label">实付金额：</span>
                <span class="fee-value total">¥{{ (orderDetail.actualAmount ?? 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- 备注信息 -->
          <div class="info-section" v-if="orderDetail.remark">
            <h3 class="section-title">备注信息</h3>
            <div class="remark-content">
              {{ orderDetail.remark }}
            </div>
          </div>

          <!-- 取消/退款原因 -->
          <div class="info-section" v-if="orderDetail.cancelReason">
            <h3 class="section-title">取消原因</h3>
            <div class="remark-content">
              {{ orderDetail.cancelReason }}
            </div>
          </div>

          <div class="info-section" v-if="orderDetail.refundReason">
            <h3 class="section-title">退款原因</h3>
            <div class="remark-content">
              {{ orderDetail.refundReason }}
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <a-button v-if="orderDetail.status === 0" type="primary" @click="handlePayOrder">
              立即支付
            </a-button>
            <a-button v-if="orderDetail.status === 0" @click="handleCancelOrder">
              取消订单
            </a-button>
            <a-button @click="router.back()">返回</a-button>
          </div>
        </div>

        <a-empty v-else description="订单不存在" />
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const orderDetail = ref<API.Order | null>(null)
const orderItems = ref<API.OrderItem[]>([])

const itemColumns = [
  { title: '商品图片', key: 'productImage' },
  { title: '商品名称', dataIndex: 'productName', key: 'productName' },
  { title: '规格', dataIndex: 'specs', key: 'specs' },
  { title: '数量', dataIndex: 'quantity', key: 'quantity' },
  { title: '单价', key: 'price' },
  { title: '小计', key: 'totalPrice' },
]

const getStatusText = (status?: number) => {
  switch (status) {
    case 0: return '待支付'
    case 1: return '已支付'
    case 2: return '已取消'
    case 3: return '已完成'
    case 4: return '退款中'
    case 5: return '已退款'
    default: return '未知'
  }
}

const getStatusColor = (status?: number) => {
  switch (status) {
    case 0: return 'orange'
    case 1: return 'blue'
    case 2: return 'default'
    case 3: return 'green'
    case 4: return 'orange'
    case 5: return 'red'
    default: return 'default'
  }
}

// 加载订单详情
const loadOrderDetail = async () => {
  const orderId = Number(route.params.orderId)
  if (!orderId) {
    message.error('订单ID无效')
    router.push('/user/orders')
    return
  }

  try {
    loading.value = true
    const res = await api.orderController.getMyOrderDetail({ orderId })
    if (res.data?.code === 0 && res.data.data) {
      orderDetail.value = res.data.data
      
      // 加载订单商品
      await loadOrderItems(orderId)
    } else {
      message.error('订单不存在')
      setTimeout(() => {
        router.push('/user/orders')
      }, 2000)
    }
  } catch (error) {
    console.error('加载订单详情失败:', error)
    message.error('加载订单详情失败')
    setTimeout(() => {
      router.push('/user/orders')
    }, 2000)
  } finally {
    loading.value = false
  }
}

// 加载订单商品
const loadOrderItems = async (orderId: number) => {
  try {
    const res = await api.orderController.listOrderItems({ orderId })
    if (res.data?.code === 0 && res.data.data) {
      orderItems.value = res.data.data || []
    }
  } catch (error) {
    console.error('加载订单商品失败:', error)
  }
}

// 支付订单
const handlePayOrder = () => {
  if (!orderDetail.value) return
  
  Modal.confirm({
    title: '确认支付',
    content: `订单金额：¥${orderDetail.value.actualAmount?.toFixed(2)}`,
    onOk: async () => {
      try {
        const res = await api.orderController.payOrder({
          orderId: orderDetail.value!.id!,
          payMethod: 1 // 1-微信支付，可以先固定
        })
        if (res.data?.code === 0) {
          message.success('支付成功')
          await loadOrderDetail()
        } else {
          message.error(res.data?.message || '支付失败')
        }
      } catch (error) {
        console.error('支付失败:', error)
        message.error('支付失败')
      }
    }
  })
}

// 取消订单
const handleCancelOrder = () => {
  if (!orderDetail.value) return
  
  Modal.confirm({
    title: '确认取消订单',
    content: '确定要取消该订单吗？',
    onOk: async () => {
      try {
        const res = await api.orderController.cancelOrder({
          orderId: orderDetail.value!.id!,
          reason: '用户主动取消'
        })
        if (res.data?.code === 0) {
          message.success('订单已取消')
          await loadOrderDetail()
        } else {
          message.error(res.data?.message || '取消订单失败')
        }
      } catch (error) {
        console.error('取消订单失败:', error)
        message.error('取消订单失败')
      }
    }
  })
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.order-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e8e8e8;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #1890ff;
}

.info-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item .label {
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.info-item .value {
  color: #333;
}

.item-columns {
  background: white;
}

.fee-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.fee-row.total {
  padding-top: 12px;
  border-top: 2px solid #e8e8e8;
  font-size: 18px;
  font-weight: bold;
}

.fee-label {
  color: #666;
}

.fee-value {
  color: #333;
  font-weight: 500;
}

.fee-value.discount {
  color: #52c41a;
}

.fee-value.total {
  color: #e74c3c;
  font-size: 24px;
}

.remark-content {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  color: #666;
  line-height: 1.8;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 12px;
  }

  .info-section {
    padding: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .ant-btn {
    width: 100%;
  }
}
</style>

