<template>
  <div class="admin-message-wall">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="walls" tab="景点留言墙">
        <div class="scenic-walls">
          <div class="controls">
            <a-button type="primary" @click="showCreateModal">创建留言墙</a-button>
          </div>
          <a-table :columns="wallColumns" :data-source="wallList" :pagination="false" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button size="small" @click="showEditModal(record)">编辑</a-button>
                  <a-button size="small" @click="viewMessages(record)">查看留言</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key="messages" tab="留言管理">
        <div class="controls">
          <a-space>
            <a-input-search v-model:value="keyword" placeholder="按内容搜索" @search="onSearch" />
            <a-select v-model:value="selectedScenicSpot" placeholder="选择景点" style="width: 200px" @change="onScenicSpotChange">
              <a-select-option v-for="spot in scenicSpots" :key="spot.id" :value="spot.id">
                {{ spot.name }}
              </a-select-option>
            </a-select>
          </a-space>
        </div>

        <a-table :columns="columns" :data-source="list" :pagination="false" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <span>{{ getStatusText(record.status) }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button size="small" @click="review(record, 1)">通过</a-button>
                <a-button size="small" danger @click="review(record, 2)">驳回</a-button>
                <a-button size="small" @click="remove(record)">删除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>

        <div class="pagination">
          <a-pagination :current="page" :page-size="pageSize" :total="total" @change="onPageChange" />
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:open="showModal"
      :title="modalTitle"
      @ok="handleModalOk"
    >
      <a-form :model="modalForm" layout="vertical">
        <a-form-item label="景点" required>
          <a-select 
            v-if="!isEditMode" 
            v-model:value="modalForm.scenicSpotId" 
            placeholder="请选择景点"
          >
            <a-select-option
              v-for="spot in scenicSpots"
              :key="spot.id"
              :value="spot.id"
            >
              {{ spot.name }}
            </a-select-option>
          </a-select>
          <a-input 
            v-else 
            :value="getScenicSpotName(modalForm.scenicSpotId)" 
            disabled 
          />
        </a-form-item>
        <a-form-item label="标题" required>
          <a-input v-model:value="modalForm.title" placeholder="请输入留言墙标题" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="modalForm.description" :rows="4" placeholder="请输入留言墙描述（可选）" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { messageWallApi } from '@/api/messageWallApi'
import { listSpots } from '@/api/scenicController'
import { handleApiError } from '@/utils/errorHandler'
import { createComponentLogger } from '@/utils/logger'
import { MESSAGE_WALL, PAGINATION } from '@/constants'

// 创建组件专用logger
const logger = createComponentLogger('AdminMessageWall')

const activeTab = ref('walls')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const selectedScenicSpot = ref<number>()
const list = ref<Array<any>>([])
const wallList = ref<Array<any>>([])
const scenicSpots = ref<Array<any>>([])

// 创建/编辑模态框
const showModal = ref(false)
const modalTitle = ref('')
const isEditMode = ref(false) // 标记是编辑还是创建
const modalForm = reactive({
  scenicSpotId: undefined as number | undefined,
  title: '',
  description: ''
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '作者', dataIndex: 'userName', key: 'userName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const wallColumns = [
  { title: '景点', dataIndex: 'scenicSpotName', key: 'scenicSpotName' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '留言数', dataIndex: 'messageCount', key: 'messageCount' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action' }
]

// 加载景点列表
const loadScenicSpots = async () => {
  try {
    logger.debug('开始加载景点列表')
    const res = await listSpots()
    // 处理响应数据：后端返回 BaseResponse<List<ScenicSpot>>
    if (res.data && res.data.code === 0 && res.data.data) {
      scenicSpots.value = res.data.data
      logger.info('景点列表加载成功', { count: scenicSpots.value.length })
    } else {
      scenicSpots.value = []
      logger.error('加载景点列表失败', { message: res.data?.message })
    }
  } catch (error) {
    logger.error('加载景点列表异常', error)
    handleApiError(error, { customMessage: '加载景点列表失败' })
    scenicSpots.value = []
  }
}

// 加载留言墙列表
const loadWalls = async () => {
  try {
    logger.debug('开始加载留言墙列表')
    const res = await messageWallApi.getAllScenicMessageWalls()
    // 处理响应数据：后端返回 BaseResponse<List<ScenicMessageWallVO>>
    if (res.data && res.data.code === 0 && res.data.data) {
      wallList.value = res.data.data
      logger.info('留言墙列表加载成功', { count: wallList.value.length })
    } else {
      wallList.value = []
      logger.error('加载留言墙列表失败', { message: res.data?.message })
    }
  } catch (error) {
    logger.error('加载留言墙列表异常', error)
    handleApiError(error, { customMessage: '加载留言墙列表失败' })
    wallList.value = []
  }
}

// 加载留言列表
const loadMessages = async () => {
  // 修正：scenicSpotId为undefined时不传
  const query: any = {
    current: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value
  }
  if (selectedScenicSpot.value !== undefined && selectedScenicSpot.value !== null && !isNaN(selectedScenicSpot.value)) {
    query.scenicSpotId = selectedScenicSpot.value
  }
  
  try {
    logger.debug('开始加载留言列表', query)
    const res = await messageWallApi.listMessages(query)
    // 处理响应数据：后端返回 BaseResponse<Page<MessageWallVO>>
    const responseData = res.data
    if (responseData && responseData.code === 0 && responseData.data) {
      const pageData = responseData.data
      list.value = pageData.records || []
      total.value = pageData.total || 0
      logger.info('留言列表加载成功', { count: list.value.length, total: total.value })
    } else {
      list.value = []
      total.value = 0
      logger.error('加载留言列表失败', { message: responseData?.message })
    }
  } catch (error) {
    list.value = [] // 防止异常时残留旧数据
    total.value = 0
    logger.error('加载留言列表异常', error)
    handleApiError(error, { customMessage: '加载留言列表失败' })
  }
}

// tab切换时自动刷新留言列表
watch(activeTab, (val) => {
  if (val === 'messages') {
    loadMessages()
  }
})

// 显示创建模态框
const showCreateModal = () => {
  modalTitle.value = '创建留言墙'
  isEditMode.value = false
  modalForm.scenicSpotId = undefined
  modalForm.title = ''
  modalForm.description = ''
  showModal.value = true
}

// 显示编辑模态框
const showEditModal = (record: any) => {
  modalTitle.value = '编辑留言墙'
  isEditMode.value = true
  modalForm.scenicSpotId = record.scenicSpotId
  modalForm.title = record.title || ''
  modalForm.description = record.description || ''
  showModal.value = true
}

// 查看指定留言墙的留言
const viewMessages = (record: any) => {
  activeTab.value = 'messages'
  selectedScenicSpot.value = record.scenicSpotId
  loadMessages()
}

// 获取景点名称
const getScenicSpotName = (spotId: number | undefined): string => {
  if (!spotId) return ''
  const spot = scenicSpots.value.find((s: any) => s.id === spotId)
  return spot ? spot.name : ''
}

// 获取状态文本
const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    [MESSAGE_WALL.STATUS.PENDING]: '待审核',
    [MESSAGE_WALL.STATUS.APPROVED]: '已通过',
    [MESSAGE_WALL.STATUS.REJECTED]: '已拒绝'
  }
  return statusMap[status] || String(status)
}

// 提交表单
const handleModalOk = async () => {
  try {
    // 参数验证
    if (!modalForm.scenicSpotId) {
      message.error('请选择景点')
      return
    }
    if (!modalForm.title || !modalForm.title.trim()) {
      message.error('请输入标题')
      return
    }

    logger.debug(isEditMode.value ? '更新留言墙' : '创建留言墙', modalForm)

    if (isEditMode.value) {
      await messageWallApi.updateScenicMessageWall(modalForm)
      message.success('更新成功')
      logger.info('留言墙更新成功')
    } else {
      await messageWallApi.createScenicMessageWall(modalForm)
      message.success('创建成功')
      logger.info('留言墙创建成功')
    }
    showModal.value = false
    loadWalls()
  } catch (error) {
    logger.error('操作留言墙失败', error)
    handleApiError(error, { customMessage: '操作失败' })
  }
}

// 景点选择变化
const onScenicSpotChange = () => {
  page.value = 1
  loadMessages()
}


// 搜索
const onSearch = () => {
  page.value = 1
  loadMessages()
}

// 页码变化
const onPageChange = (p: number) => {
  page.value = p
  loadMessages()
}

// 审核留言
const review = async (record: any, status: number) => {
  try {
    logger.debug('审核留言', { messageId: record.id, status })
    await messageWallApi.reviewMessage({ messageId: record.id, status })
    message.success(status === MESSAGE_WALL.STATUS.APPROVED ? '审核通过' : '已驳回')
    logger.info('审核留言成功', { messageId: record.id, status })
    loadMessages()
  } catch (error) {
    logger.error('审核留言失败', error)
    handleApiError(error, { customMessage: '操作失败' })
  }
}

// 删除留言
const remove = async (record: any) => {
  try {
    logger.debug('删除留言', { messageId: record.id })
    await messageWallApi.deleteMessage(record.id)
    logger.info('删除留言成功', { messageId: record.id })
    message.success('删除成功')
    loadMessages()
  } catch (error) {
    logger.error('删除留言失败', error)
    handleApiError(error, { customMessage: '删除失败' })
  }
}

// 初始化
onMounted(() => {
  loadScenicSpots()
  loadWalls()
})
</script>

<style scoped>
.admin-message-wall {
  padding: 20px;
}

.controls {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scenic-walls {
  margin-bottom: 24px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
}

:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}

.ant-modal-content {
  padding: 20px;
}
</style>
