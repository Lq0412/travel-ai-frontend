<template>
  <div class="order-list-page">
    <div class="orders-header">
      <h2>我的订单</h2>
      <a-button type="default" @click="loadOrders">刷新</a-button>
    </div>

    <a-empty v-if="!loading && orders.length === 0" description="暂无订单">
      <template #image>
        <FileTextOutlined style="font-size: 48px; color: #ccc" />
      </template>
      <a-button type="primary" @click="router.push('/user/shop')">去购物</a-button>
    </a-empty>

    <a-table
      v-else
      :data-source="orders"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="false"
      :expandable="{ defaultExpandAllRows: false }"
      @expand="onExpand"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'totalAmount'">
          ¥{{ (record.totalAmount ?? 0).toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'actualAmount'">
          ¥{{ (record.actualAmount ?? 0).toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewDetail(record.id)">详情</a-button>
            <a-popconfirm
              v-if="record.status === 0"
              title="确认取消订单？"
              @confirm="cancelOrder(record.id)"
              ok-text="确认"
              cancel-text="取消"
            >
              <template #default><a-button type="link" size="small" danger>取消</a-button></template>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <a-table
          :data-source="orderItemsMap.get(record.id) || []"
          :columns="itemColumns"
          row-key="id"
          size="small"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'price'">
              ¥{{ (record.price ?? 0).toFixed(2) }}
            </template>
          </template>
        </a-table>
      </template>
    </a-table>

    <div class="pagination-container" v-if="total > 0">
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        show-size-changer
        show-quick-jumper
        @change="handleCurrentChange"
        @show-size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { FileTextOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const router = useRouter()

const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orders = ref<API.Order[]>([])
const orderItemsMap = ref(new Map<number, API.OrderItem[]>())

const columns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '商家ID', dataIndex: 'merchantId', key: 'merchantId' },
  { title: '总金额', key: 'totalAmount' },
  { title: '实付', key: 'actualAmount' },
  { title: '状态', key: 'status' },
  { title: '下单时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action' },
]

const itemColumns = [
  { title: '商品', dataIndex: 'productName', key: 'productName' },
  { title: '规格', dataIndex: 'specs', key: 'specs' },
  { title: '数量', dataIndex: 'quantity', key: 'quantity' },
  { title: '单价', key: 'price' },
]

const loadOrders = async () => {
  try {
    loading.value = true
    const res = await api.orderController.listMyOrders({ current: current.value, size: pageSize.value })
    if (res.data?.code === 0 && res.data.data) {
      orders.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    } else {
      message.error(res.data?.message || '获取订单失败')
    }
  } catch (e) {
    console.error(e)
    message.error('获取订单失败')
  } finally {
    loading.value = false
  }
}

const onExpand = async (expanded: boolean, record: API.Order) => {
  if (!expanded || !record?.id) return
  if (orderItemsMap.value.has(record.id)) return
  try {
    const res = await api.orderController.listOrderItems({ orderId: Number(record.id) })
    if (res.data?.code === 0) {
      orderItemsMap.value.set(Number(record.id), res.data.data || [])
    }
  } catch (e) {
    console.error(e)
  }
}

const handleCurrentChange = (page: number) => {
  current.value = page
  loadOrders()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  current.value = 1
  loadOrders()
}

// 获取状态文本
const getStatusText = (status?: number) => {
  switch (status) {
    case 0:
      return '待支付'
    case 1:
      return '已支付'
    case 2:
      return '已取消'
    case 3:
      return '已完成'
    case 4:
      return '退款中'
    case 5:
      return '已退款'
    default:
      return '未知'
  }
}

// 获取状态颜色
const getStatusColor = (status?: number) => {
  switch (status) {
    case 0:
      return 'orange'
    case 1:
      return 'blue'
    case 2:
      return 'default'
    case 3:
      return 'green'
    case 4:
      return 'orange'
    case 5:
      return 'red'
    default:
      return 'default'
  }
}

// 查看详情
const viewDetail = (orderId?: number) => {
  if (orderId) {
    router.push(`/user/orders/${orderId}`)
  }
}

// 取消订单
const cancelOrder = async (orderId?: number) => {
  if (!orderId) return
  try {
    const res = await api.orderController.cancelOrder({
      orderId,
      reason: '用户主动取消'
    })
    if (res.data?.code === 0) {
      message.success('订单已取消')
      await loadOrders()
    } else {
      message.error(res.data?.message || '取消订单失败')
    }
  } catch (e) {
    console.error(e)
    message.error('取消订单失败')
  }
}

onMounted(loadOrders)
</script>

<style scoped>
.order-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
