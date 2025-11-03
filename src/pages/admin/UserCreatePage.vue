<template>
  <div class="user-create-page">
    <a-card title="创建用户">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" :rules="rules">
        <a-form-item label="账号" name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="用户名" name="userName">
          <a-input v-model:value="form.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="头像URL" name="userAvatar">
          <a-input v-model:value="form.userAvatar" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="简介" name="userProfile">
          <a-textarea v-model:value="form.userProfile" :rows="3" />
        </a-form-item>
        <a-form-item label="角色" name="userRole" :rules="[{ required: true, message: '请选择角色' }]">
          <a-select v-model:value="form.userRole">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-space>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
            <a-button @click="goBack">返回</a-button>
          </a-space>
        </a-form-item>
        <div style="color:#999">初始密码将默认为 12345678</div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { addUser } from '@/api/userController'

const router = useRouter()
const submitting = ref(false)
const form = reactive<API.UserAddRequest>({ userRole: 'user' })

const rules = {
  userAccount: [{ required: true, message: '请输入账号' }],
  userRole: [{ required: true, message: '请选择角色' }],
}

const handleSubmit = async () => {
  if (!form.userAccount) return message.warning('请输入账号')
  if (!form.userRole) return message.warning('请选择角色')
  try {
    submitting.value = true
    const res = await addUser(form)
    if (res.data?.code === 0) {
      message.success('创建成功')
      router.push('/admin/userManage')
    } else {
      message.error(res.data?.message || '创建失败')
    }
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped>
.user-create-page { padding: 16px; }
</style>
