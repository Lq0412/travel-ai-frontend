<template>
  <div class="merchant-manage-page">
    <a-form :model="searchParams" layout="inline" @finish="doSearch">
      <a-form-item label="名称">
        <a-input v-model:value="searchParams.name" allow-clear placeholder="输入商家名称" />
      </a-form-item>
      <a-form-item label="类型">
        <a-select v-model:value="searchParams.type" allow-clear style="width: 160px">
          <a-select-option :value="1">美食</a-select-option>
          <a-select-option :value="2">工艺品</a-select-option>
          <a-select-option :value="3">农产品</a-select-option>
          <a-select-option :value="4">酒店</a-select-option>
          <a-select-option :value="5">娱乐</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="button" @click="openAdd">新增商家</a-button>
      </a-form-item>
    </a-form>

    <div style="margin: 16px 0" />

    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" row-key="id" @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'logoUrl'">
          <a-image :src="record.logoUrl" :width="80" />
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'orange'">{{ record.status === 1 ? '营业中' : '非营业' }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除？" @confirm="doDelete(record.id)">
              <a-button danger type="link">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal 
      v-model:open="modalOpen" 
      :title="isEdit ? '编辑商家' : '新增商家'" 
      @ok="handleOk" 
      @cancel="handleCancel" 
      :confirm-loading="saving" 
      width="800px"
      :mask-closable="false"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" ref="formRef">
        <a-form-item label="关联用户" name="userId">
          <a-select
            v-model:value="form.userId"
            :placeholder="isEdit ? '选择要关联的用户' : '选择已有用户（可选，不选则关联当前管理员）'"
            show-search
            allow-clear
            style="width: 100%"
            :loading="loadingUsers"
            option-filter-prop="children"
          >
            <a-select-option 
              v-for="(user, index) in userList" 
              :key="`user-${user.id}-${index}`" 
              :value="String(user.id)"
            >
              {{ user.userName }} ({{ user.userAccount }}) {{ user.userRole === 'merchant' ? '[已是商家]' : '' }}
            </a-select-option>
          </a-select>
          <div style="margin-top: 4px; color: #999; font-size: 12px">
            {{ isEdit ? '修改关联用户后，系统会自动更新对应用户的角色为商家' : '选择已有用户后，系统会自动将该用户角色更新为商家' }}
          </div>
        </a-form-item>
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入商家名称' }]">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择商家类型' }]">
          <a-select v-model:value="form.type" placeholder="请选择商家类型">
            <a-select-option :value="1">美食</a-select-option>
            <a-select-option :value="2">工艺品</a-select-option>
            <a-select-option :value="3">农产品</a-select-option>
            <a-select-option :value="4">酒店</a-select-option>
            <a-select-option :value="5">娱乐</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简介"><a-textarea v-model:value="form.introduction" :rows="3" /></a-form-item>
        <a-form-item label="封面图"><a-input v-model:value="form.coverUrl" placeholder="图片URL" /></a-form-item>
        <a-form-item label="Logo"><a-input v-model:value="form.logoUrl" placeholder="图片URL" /></a-form-item>
        <a-form-item label="地址"><a-input v-model:value="form.location" /></a-form-item>
        <a-form-item label="电话"><a-input v-model:value="form.contactPhone" /></a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option :value="1">营业中</a-select-option>
            <a-select-option :value="0">停业</a-select-option>
            <a-select-option :value="2">下架</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import api from '@/api'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 100 },
  { title: '名称', dataIndex: 'name', width: 150 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '关联用户ID', dataIndex: 'userId', width: 150 },
  { title: 'Logo', dataIndex: 'logoUrl', width: 100 },
  { title: '电话', dataIndex: 'contactPhone', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150 },
]

const dataList = ref<API.Merchant[]>([])
const total = ref(0)

const searchParams = reactive<API.MerchantQueryRequest>({
  current: 1,
  pageSize: 10,
})

const pagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const fetchData = async () => {
  const res = await api.merchantController.adminListMerchants(searchParams)
  if (res.data?.code === 0 && res.data.data) {
    dataList.value = res.data.data.records || []
    total.value = res.data.data.total || 0
  } else {
    message.error(res.data?.message || '加载失败')
  }
}

onMounted(fetchData)

const doTableChange = (page: { current: number; pageSize: number }) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const modalOpen = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const loadingUsers = ref(false)
const userList = ref<API.UserVO[]>([])
const formRef = ref()
const form = reactive<API.Merchant>({ 
  status: 1,
  userId: undefined, // 初始化为 undefined，但在重置时使用 null
  name: '',
  type: undefined,
  introduction: '',
  coverUrl: '',
  logoUrl: '',
  location: '',
  contactPhone: ''
})

// 加载用户列表
const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const res = await api.userController.listUserVoByPage({
      current: 1,
      pageSize: 100, // 获取前100个用户
    })
    if (res.data?.code === 0 && res.data.data) {
      userList.value = res.data.data.records || []
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loadingUsers.value = false
  }
}

// 当弹窗打开时加载用户列表
watch(modalOpen, (open) => {
  if (open) {
    loadUsers()
  }
})

const openAdd = () => {
  isEdit.value = false
  // 重置表单数据，确保所有值都是有效的
  // 注意：将 userId 设置为 undefined，避免传递无效值
  form.id = undefined
  form.userId = undefined // 使用 undefined，Ant Design Vue 可以正确处理
  form.name = ''
  form.type = undefined
  form.introduction = ''
  form.coverUrl = ''
  form.logoUrl = ''
  form.location = ''
  form.contactPhone = ''
  form.status = 1
  console.log('openAdd - form状态:', form)
  modalOpen.value = true
}

const openEdit = (record: API.Merchant) => {
  isEdit.value = true
  Object.assign(form, record)
  modalOpen.value = true
}

const handleOk = async () => {
  try {
    // 验证表单
    await formRef.value.validate()
    
    saving.value = true
    if (isEdit.value) {
      // 编辑时，保持 userId 为字符串格式（避免大整数精度丢失）
      const submitForm: any = { ...form }
      if (submitForm.userId !== undefined && submitForm.userId !== null && submitForm.userId !== '') {
        // 保持为字符串，让后端处理转换
        submitForm.userId = String(submitForm.userId)
      }
      const res = await api.merchantController.adminUpdateMerchant(submitForm)
      if (res.data?.code === 0) {
        message.success('更新成功')
        modalOpen.value = false
        formRef.value?.resetFields()
        fetchData()
      } else {
        message.error(res.data?.message || '更新失败')
      }
    } else {
      // 处理 userId：保持为字符串或原始值，避免大整数精度丢失
      const submitForm: any = { ...form }
      // 明确处理 userId：如果存在且不是 undefined/null/空字符串，保持原始值（不转换为 Number）
      // 注意：JavaScript 的 Number 类型只能安全表示 -2^53+1 到 2^53-1 之间的整数
      // 对于更大的 ID（如雪花算法生成的 ID），必须保持为字符串
      if (submitForm.userId !== undefined && submitForm.userId !== null && submitForm.userId !== '') {
        // 如果是字符串或数字，验证是否为有效值，但保持原始类型
        const userIdStr = String(submitForm.userId).trim()
        if (userIdStr === '' || userIdStr === '0' || userIdStr === 'undefined' || userIdStr === 'null') {
          // userId 无效，移除该字段，让后端使用当前管理员ID
          delete submitForm.userId
        } else {
          // 保持为字符串格式，让后端处理转换（避免精度丢失）
          submitForm.userId = userIdStr
        }
      } else {
        // userId 为空，移除该字段，让后端使用当前管理员ID
        delete submitForm.userId
      }
      // 确保 type 有值（如果验证通过，这里应该已经有值了，但为了安全再次检查）
      if (!submitForm.type) {
        message.error('请选择商家类型')
        return
      }
      console.log('提交商家数据:', JSON.stringify(submitForm, null, 2))
      const res = await api.merchantController.adminAddMerchant(submitForm)
      if (res.data?.code === 0) {
        message.success('新增成功')
        modalOpen.value = false
        formRef.value?.resetFields()
        fetchData()
      } else {
        message.error(res.data?.message || '新增失败')
      }
    }
  } catch (error: any) {
    if (error.errorFields) {
      // 表单验证失败
      return
    }
    message.error('操作失败')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  modalOpen.value = false
  // 重置表单验证状态
  formRef.value?.resetFields()
}

const doDelete = async (id?: number) => {
  if (!id) return
  const res = await api.merchantController.adminDeleteMerchant({ id })
  if (res.data?.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error(res.data?.message || '删除失败')
  }
}
</script>

<style scoped>
.merchant-manage-page {
  padding: 16px;
}
</style>

