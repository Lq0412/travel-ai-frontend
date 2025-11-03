<template>
  <div class="merchant-create-page">
    <a-card title="创建商家">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" :rules="rules">
        <a-form-item label="关联用户" name="userId">
          <a-select
            v-model:value="form.userId"
            placeholder="选择已有用户（可选，不选则关联当前管理员）"
            show-search
            :filter-option="filterUserOption"
            allow-clear
            style="width: 100%"
            :loading="loadingUsers"
          >
            <a-select-option v-for="user in userList" :key="user.id" :value="user.id">
              {{ user.userName }} ({{ user.userAccount }})
            </a-select-option>
          </a-select>
          <div style="margin-top: 4px; color: #999; font-size: 12px">
            选择已有用户后，系统会自动将该用户角色更新为商家
          </div>
        </a-form-item>
        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入商家名称' }]">
          <a-input v-model:value="form.name" placeholder="请输入商家名称" />
        </a-form-item>
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
          <a-select v-model:value="form.type" placeholder="请选择类型">
            <a-select-option :value="1">美食</a-select-option>
            <a-select-option :value="2">工艺品</a-select-option>
            <a-select-option :value="3">农产品</a-select-option>
            <a-select-option :value="4">酒店</a-select-option>
            <a-select-option :value="5">娱乐</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简介" name="introduction">
          <a-textarea v-model:value="form.introduction" :rows="3" />
        </a-form-item>
        <a-form-item label="封面图" name="coverUrl">
          <a-input v-model:value="form.coverUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="Logo" name="logoUrl">
          <a-input v-model:value="form.logoUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="地址" name="location">
          <a-input v-model:value="form.location" />
        </a-form-item>
        <a-form-item label="电话" name="contactPhone">
          <a-input v-model:value="form.contactPhone" />
        </a-form-item>
        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="form.status">
            <a-select-option :value="1">营业中</a-select-option>
            <a-select-option :value="0">停业</a-select-option>
            <a-select-option :value="2">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-space>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
            <a-button @click="goBack">返回</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '@/api'

const router = useRouter()
const submitting = ref(false)
const loadingUsers = ref(false)
const userList = ref<API.UserVO[]>([])
const form = reactive<API.Merchant>({ status: 1 })

const rules = {
  name: [{ required: true, message: '请输入商家名称' }],
  type: [{ required: true, message: '请选择类型' }],
  status: [{ required: true, message: '请选择状态' }],
}

const handleSubmit = async () => {
  if (!form.name) return message.warning('请输入商家名称')
  if (!form.type) return message.warning('请选择类型')
  if (form.status === undefined || form.status === null) return message.warning('请选择状态')
  try {
    submitting.value = true
    const res = await api.merchantController.adminAddMerchant(form)
    if (res.data?.code === 0) {
      message.success('创建成功')
      router.push('/admin/merchantManage')
    } else {
      message.error(res.data?.message || '创建失败')
    }
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.back()

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

// 用户搜索过滤
const filterUserOption = (input: string, option: any) => {
  const label = option.children || option.label || ''
  return label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.merchant-create-page { padding: 16px; }
</style>
