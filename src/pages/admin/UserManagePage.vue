<template>
  <div id="userManagePage" class="page-container">
    <a-card title="用户管理">
      <!-- 搜索表单 -->
      <a-form :model="searchParams" layout="inline" @finish="doSearch" style="margin-bottom: 16px">
        <a-form-item label="账号">
          <a-input
            v-model:value="searchParams.userAccount"
            allow-clear
            placeholder="输入账号"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            v-model:value="searchParams.userName"
            allow-clear
            placeholder="输入用户名"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button html-type="submit" type="primary">搜索</a-button>
            <a-button @click="resetSearch">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <!-- 操作按钮区域 -->
      <div style="margin-bottom: 16px">
        <a-space>
          <a-button type="primary" @click="openAdd">创建用户</a-button>
          <a-button @click="goCreateMerchant">创建商家</a-button>
        </a-space>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar" :width="120" />
          </template>
          <template v-else-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'admin'">
              <a-tag color="green">管理员</a-tag>
            </div>
            <div v-else-if="record.userRole === 'merchant'">
              <a-tag color="orange">商家</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">普通用户</a-tag>
            </div>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            {{ new Date(record.createTime).toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="openEdit(record)">编辑</a-button>
              <a-button danger @click="doDelete(record.id)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="modalOpen"
      :title="isEdit ? '编辑用户' : '新增用户'"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="saving"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="账号">
          <a-input v-model:value="form.userAccount" :disabled="isEdit" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="form.userName" />
        </a-form-item>
        <a-form-item label="头像URL">
          <a-input v-model:value="form.userAvatar" />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea v-model:value="form.userProfile" :rows="3" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="form.userRole">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div v-if="!isEdit" style="margin-top: 8px; color: #999">初始密码将默认为 12345678</div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { addUser, deleteUser, listUserVoByPage, updateUser } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据列表
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'ascend',
})

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPage({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 表格变化时重新获取数据
const doTableChange = (page: { current: number; pageSize: number }) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchParams.userAccount = ''
  searchParams.userName = ''
  searchParams.current = 1
  fetchData()
}

// 删除用户
const doDelete = async (id: number) => {
  if (id === undefined || id === null) {
    return
  }
  const res = await deleteUser({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 弹窗相关状态
const modalOpen = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const form = reactive<API.UserUpdateRequest & API.UserAddRequest & { id?: number }>({
  userRole: 'user',
})

// 打开新增弹窗
const openAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: undefined,
    userAccount: '',
    userName: '',
    userAvatar: '',
    userProfile: '',
    userRole: 'user',
  })
  modalOpen.value = true
}

// 打开编辑弹窗
const openEdit = (record: API.UserVO) => {
  isEdit.value = true
  Object.assign(form, record)
  modalOpen.value = true
}

// 提交表单（新增/编辑）
const handleOk = async () => {
  try {
    saving.value = true
    if (isEdit.value) {
      const res = await updateUser(form)
      if (res.data?.code === 0) {
        message.success('更新成功')
        modalOpen.value = false
        fetchData()
      } else {
        message.error(res.data?.message || '更新失败')
      }
    } else {
      const res = await addUser(form)
      if (res.data?.code === 0) {
        message.success('新增成功')
        modalOpen.value = false
        fetchData()
      } else {
        message.error(res.data?.message || '新增失败')
      }
    }
  } finally {
    saving.value = false
  }
}

// 关闭弹窗
const handleCancel = () => {
  modalOpen.value = false
  isEdit.value = false
  Object.assign(form, { userRole: 'user' })
}

// 跳转到创建商家页面
const goCreateMerchant = () => router.push('/admin/merchantCreate')
</script>

<style scoped lang="less">
.page-container {
  padding: 10px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}

:deep(.ant-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
