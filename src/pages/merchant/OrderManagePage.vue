<template>
  <div class="order-manage-page">
    <div class="orders-header">
      <h2>订单管理</h2>
      <a-button type="default" @click="loadOrders">刷新</a-button>
    </div>

    <!-- 搜索和筛选 -->
    <a-form :model="searchParams" layout="inline" @finish="doSearch" style="margin-bottom: 16px">
      <a-form-item label="订单号">
        <a-input v-model:value="searchParams.orderNo" allow-clear placeholder="输入订单号" style="width: 200px" />
      </a-form-item>
      <a-form-item label="订单状态">
        <a-select v-model:value="searchParams.status" allow-clear placeholder="选择状态" style="width: 150px">
          <a-select-option :value="0">待支付</a-select-option>
          <a-select-option :value="1">已支付</a-select-option>
          <a-select-option :value="2">已取消</a-select-option>
          <a-select-option :value="3">已完成</a-select-option>
          <a-select-option :value="4">退款中</a-select-option>
          <a-select-option :value="5">已退款</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary">搜索</a-button>
        <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
      </a-form-item>
    </a-form>

    <a-empty v-if="!loading && orders.length === 0" description="暂无订单">
      <template #image>
        <FileTextOutlined style="font-size: 48px; color: #ccc" />
      </template>
    </a-empty>

    <a-table
      v-else
      :data-source="orders"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @change="handleTableChange"
      @expand="onExpand"
      :expandable="{ defaultExpandAllRows: false }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'orderNo'">
          <a-typography-text copyable>{{ record.orderNo }}</a-typography-text>
        </template>
        <template v-else-if="column.key === 'totalAmount'">
          <span style="color: #f5222d; font-weight: bold">¥{{ (record.totalAmount ?? 0).toFixed(2) }}</span>
        </template>
        <template v-else-if="column.key === 'actualAmount'">
          <span style="color: #52c41a; font-weight: bold">¥{{ (record.actualAmount ?? 0).toFixed(2) }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="viewDetail(record.id)">详情</a-button>
            <a-button 
              v-if="record.status === 1" 
              type="link" 
              size="small" 
              @click="handleShip(record.id)"
              style="color: #52c41a"
            >
              发货
            </a-button>
            <a-popconfirm
              v-if="record.status === 0 || record.status === 1"
              title="确认取消订单？"
              @confirm="cancelOrder(record.id)"
              ok-text="确认"
              cancel-text="取消"
            >
              <template #default>
                <a-button type="link" size="small" danger>取消</a-button>
              </template>
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
            <template v-if="column.key === 'coverUrl'">
              <a-image :src="record.coverUrl" :width="60" :preview="false" />
            </template>
            <template v-else-if="column.key === 'price'">
              ¥{{ (record.price ?? 0).toFixed(2) }}
            </template>
            <template v-else-if="column.key === 'subtotal'">
              <span style="font-weight: bold">¥{{ ((record.price ?? 0) * (record.quantity ?? 0)).toFixed(2) }}</span>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>

    <!-- 订单详情弹窗 -->
    <a-modal
      v-model:open="detailModalOpen"
      title="订单详情"
      width="800px"
      :footer="null"
    >
      <div v-if="currentOrder" class="order-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="订单号">{{ currentOrder.orderNo }}</a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag :color="getStatusColor(currentOrder.status)">
              {{ getStatusText(currentOrder.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="总金额">¥{{ (currentOrder.totalAmount ?? 0).toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="实付金额">¥{{ (currentOrder.actualAmount ?? 0).toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="下单时间" :span="2">{{ currentOrder.createTime }}</a-descriptions-item>
          <a-descriptions-item label="收货地址" :span="2">{{ currentOrder.address || '无' }}</a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '无' }}</a-descriptions-item>
        </a-descriptions>
        
        <div style="margin-top: 16px">
          <h4>订单商品</h4>
          <a-table
            :data-source="orderItemsMap.get(currentOrder.id) || []"
            :columns="itemColumns"
            row-key="id"
            size="small"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'coverUrl'">
                <a-image :src="record.coverUrl" :width="60" :preview="false" />
              </template>
              <template v-else-if="column.key === 'price'">
                ¥{{ (record.price ?? 0).toFixed(2) }}
              </template>
              <template v-else-if="column.key === 'subtotal'">
                <span style="font-weight: bold">¥{{ ((record.price ?? 0) * (record.quantity ?? 0)).toFixed(2) }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>

    <!-- 发货弹窗 -->
    <a-modal
      v-model:open="shipModalOpen"
      title="订单发货"
      @ok="confirmShip"
      @cancel="() => { shipModalOpen = false; trackingNumber = '' }"
      ok-text="确认发货"
      cancel-text="取消"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="订单号">
          <a-typography-text>{{ currentOrder?.orderNo || '-' }}</a-typography-text>
        </a-form-item>
        <a-form-item label="物流单号">
          <a-input
            v-model:value="trackingNumber"
            placeholder="请输入物流单号（可选）"
          />
          <div style="margin-top: 4px; color: #999; font-size: 12px">
            物流单号为可选，发货后订单状态将更新为"已完成"
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { FileTextOutlined } from '@ant-design/icons-vue'
import api from '@/api'

const router = useRouter()

const loading = ref(false)
const orders = ref<API.Order[]>([])
const orderItemsMap = ref(new Map<number, API.OrderItem[]>())
const detailModalOpen = ref(false)
const currentOrder = ref<API.Order | null>(null)
const shipModalOpen = ref(false)
const currentShipOrderId = ref<number | undefined>()
const trackingNumber = ref('')

const searchParams = reactive({
  orderNo: '',
  status: undefined as number | undefined,
  current: 1,
  pageSize: 10,
})

const total = ref(0)

const pagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
  pageSizeOptions: ['10', '20', '50', '100'],
}))

const columns = [
  { title: '订单号', key: 'orderNo', width: 180 },
  { title: '总金额', key: 'totalAmount', width: 120 },
  { title: '实付', key: 'actualAmount', width: 120 },
  { title: '状态', key: 'status', width: 100 },
  { title: '下单时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

const itemColumns = [
  { title: '商品', dataIndex: 'productName', key: 'productName', width: 200 },
  { title: '封面', key: 'coverUrl', width: 80 },
  { title: '规格', dataIndex: 'specs', key: 'specs', width: 150 },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '单价', key: 'price', width: 100 },
  { title: '小计', key: 'subtotal', width: 100 },
]

const loadOrders = async () => {
  try {
    loading.value = true
    const params: any = {
      current: searchParams.current,
      size: searchParams.pageSize,
    }
    // 将筛选条件传给后端
    if (searchParams.orderNo) {
      params.orderNo = searchParams.orderNo
    }
    if (searchParams.status !== undefined) {
      params.status = searchParams.status
    }
    
    const res = await api.orderController.merchantListOrders(params)
    
    if (res.data?.code === 0 && res.data.data) {
      orders.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    } else {
      // 特殊处理：如果不是商家
      if (res.data?.code === 40101 || res.data?.message?.includes('还不是商家')) {
        message.warning({
          content: '您还不是商家，请联系管理员创建商家信息。如需帮助，请联系系统管理员。',
          duration: 5,
        })
      } else {
        message.error(res.data?.message || '获取订单失败')
      }
    }
  } catch (error: any) {
    console.error('获取订单列表失败:', error)
    const errorMessage = error?.response?.data?.message || '获取订单失败，请稍后重试'
    
    // 特殊处理：如果不是商家
    if (error?.response?.data?.code === 40101 || errorMessage.includes('还不是商家')) {
      message.warning({
        content: '您还不是商家，请联系管理员创建商家信息。如需帮助，请联系系统管理员。',
        duration: 5,
      })
    } else {
      message.error(errorMessage)
    }
  } finally {
    loading.value = false
  }
}

const doSearch = () => {
  searchParams.current = 1
  loadOrders()
}

const resetSearch = () => {
  searchParams.orderNo = ''
  searchParams.status = undefined
  searchParams.current = 1
  loadOrders()
}

const handleTableChange = (page: { current: number; pageSize: number }) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  loadOrders()
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
    console.error('获取订单商品失败:', e)
  }
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
const viewDetail = async (orderId?: number) => {
  if (!orderId) return
  
  try {
    const res = await api.orderController.merchantGetOrderDetail({ orderId })
    if (res.data?.code === 0 && res.data.data) {
      currentOrder.value = res.data.data
      
      // 加载订单商品
      const itemsRes = await api.orderController.listOrderItems({ orderId: Number(orderId) })
      if (itemsRes.data?.code === 0) {
        orderItemsMap.value.set(Number(orderId), itemsRes.data.data || [])
      }
      
      detailModalOpen.value = true
    } else {
      message.error(res.data?.message || '获取订单详情失败')
    }
  } catch (error: any) {
    console.error('获取订单详情失败:', error)
    message.error(error?.response?.data?.message || '获取订单详情失败')
  }
}

// 发货
const handleShip = async (orderId?: number) => {
  if (!orderId) return
  currentShipOrderId.value = orderId
  trackingNumber.value = ''
  
  // 获取订单信息用于显示
  try {
    const res = await api.orderController.merchantGetOrderDetail({ orderId })
    if (res.data?.code === 0 && res.data.data) {
      currentOrder.value = res.data.data
    }
  } catch (e) {
    console.error('获取订单信息失败:', e)
  }
  
  shipModalOpen.value = true
}

const confirmShip = async () => {
  if (!currentShipOrderId.value) return
  
  try {
    const res = await api.orderController.merchantShipOrder({
      orderId: currentShipOrderId.value,
      trackingNumber: trackingNumber.value || undefined,
    })
    
    if (res.data?.code === 0) {
      message.success('发货成功')
      shipModalOpen.value = false
      await loadOrders()
    } else {
      message.error(res.data?.message || '发货失败')
    }
  } catch (error: any) {
    console.error('发货失败:', error)
    message.error(error?.response?.data?.message || '发货失败，请稍后重试')
  }
}

// 取消订单（商家专用）
const cancelOrder = async (orderId?: number) => {
  if (!orderId) return
  
  try {
    const res = await api.orderController.merchantCancelOrder({
      orderId,
      reason: '商家取消'
    })
    if (res.data?.code === 0) {
      message.success('订单已取消')
      await loadOrders()
    } else {
      message.error(res.data?.message || '取消订单失败')
    }
  } catch (error: any) {
    console.error('取消订单失败:', error)
    message.error(error?.response?.data?.message || '取消订单失败')
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-manage-page {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 64px);
}

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-detail {
  padding: 16px 0;
}
</style>

