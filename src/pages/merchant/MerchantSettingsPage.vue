<template>
  <div class="merchant-settings-page">
    <a-card title="商家设置">
      <a-form 
        :model="form" 
        :label-col="{ span: 6 }" 
        :wrapper-col="{ span: 12 }"
        :rules="rules"
      >
        <a-form-item label="商家名称" name="name" :rules="[{ required: true, message: '请输入商家名称' }]">
          <a-input v-model:value="form.name" placeholder="请输入商家名称" />
        </a-form-item>
        
        <a-form-item label="商家类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
          <a-select v-model:value="form.type" placeholder="请选择类型">
            <a-select-option :value="1">美食</a-select-option>
            <a-select-option :value="2">工艺品</a-select-option>
            <a-select-option :value="3">农产品</a-select-option>
            <a-select-option :value="4">酒店</a-select-option>
            <a-select-option :value="5">娱乐</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="商家简介" name="introduction">
          <a-textarea v-model:value="form.introduction" :rows="4" placeholder="请输入商家简介" />
        </a-form-item>
        
        <a-form-item label="封面图">
          <a-input v-model:value="form.coverUrl" placeholder="请输入封面图URL" />
          <div v-if="form.coverUrl" style="margin-top: 8px">
            <a-image :src="form.coverUrl" :width="200" :preview="false" />
          </div>
        </a-form-item>
        
        <a-form-item label="Logo">
          <a-input v-model:value="form.logoUrl" placeholder="请输入Logo URL" />
          <div v-if="form.logoUrl" style="margin-top: 8px">
            <a-image :src="form.logoUrl" :width="100" :preview="false" />
          </div>
        </a-form-item>
        
        <a-form-item label="商家地址" name="location">
          <a-input v-model:value="form.location" placeholder="请输入商家地址" />
        </a-form-item>
        
        <a-form-item label="营业时间" name="openHours">
          <a-input v-model:value="form.openHours" placeholder="如：周一至周日 10:00-22:00" />
        </a-form-item>
        
        <a-form-item label="联系电话" name="contactPhone">
          <a-input v-model:value="form.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
        
        <a-form-item label="最低价格">
          <a-input-number 
            v-model:value="form.minPrice" 
            :precision="2" 
            :min="0" 
            style="width: 100%" 
            placeholder="最低价格"
          />
          <span style="margin-left: 8px; color: #999">元</span>
        </a-form-item>
        
        <a-form-item label="最高价格">
          <a-input-number 
            v-model:value="form.maxPrice" 
            :precision="2" 
            :min="0" 
            style="width: 100%" 
            placeholder="最高价格"
          />
          <span style="margin-left: 8px; color: #999">元</span>
        </a-form-item>
        
        <a-form-item label="商家标签">
          <a-textarea 
            v-model:value="tagsText" 
            :rows="2" 
            placeholder='JSON数组格式，如：["老字号","粤菜","性价比高"]'
          />
          <div style="margin-top: 4px; color: #999; font-size: 12px">
            以JSON数组格式输入，例如：["标签1","标签2"]
          </div>
        </a-form-item>
        
        <a-form-item label="营业状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="form.status">
            <a-select-option :value="1">营业中</a-select-option>
            <a-select-option :value="0">停业</a-select-option>
            <a-select-option :value="2">下架</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-space>
            <a-button type="primary" :loading="saving" @click="handleSubmit">保存</a-button>
            <a-button @click="loadMerchantInfo">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import api from '@/api'

const saving = ref(false)
const loading = ref(false)
const form = reactive<API.Merchant>({
  status: 1,
})

const tagsText = ref('')

const rules = {
  name: [{ required: true, message: '请输入商家名称' }],
  type: [{ required: true, message: '请选择类型' }],
  status: [{ required: true, message: '请选择状态' }],
}

// 加载商家信息
const loadMerchantInfo = async () => {
  try {
    loading.value = true
    const res = await api.merchantController.getMyMerchant()
    
    if (res.data?.code === 0 && res.data.data) {
      Object.assign(form, res.data.data)
      
      // 处理tags字段：从后端加载时，tags是JSON字符串，需要解析并显示
      if (form.tags) {
        try {
          if (typeof form.tags === 'string') {
            // 如果是字符串，尝试解析为JSON数组用于显示
            const parsed = JSON.parse(form.tags)
            if (Array.isArray(parsed)) {
              tagsText.value = JSON.stringify(parsed)
            } else {
              tagsText.value = form.tags
            }
          } else {
            // 如果已经是对象/数组，转换为JSON字符串显示
            tagsText.value = JSON.stringify(form.tags)
          }
        } catch (e) {
          // 如果解析失败，直接使用原值
          tagsText.value = typeof form.tags === 'string' ? form.tags : ''
        }
      } else {
        tagsText.value = ''
      }
    } else {
      // 特殊处理：如果不是商家
      if (res.data?.code === 40101 || res.data?.message?.includes('还不是商家')) {
        message.warning({
          content: '您还不是商家，请联系管理员创建商家信息。如需帮助，请联系系统管理员。',
          duration: 5,
        })
      } else {
        message.error(res.data?.message || '加载商家信息失败')
      }
    }
  } catch (error: any) {
    console.error('加载商家信息失败:', error)
    const errorMessage = error?.response?.data?.message || '加载商家信息失败'
    
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

// 提交表单
const handleSubmit = async () => {
  if (!form.name) {
    message.warning('请输入商家名称')
    return
  }
  if (!form.type) {
    message.warning('请选择商家类型')
    return
  }
  if (form.status === undefined || form.status === null) {
    message.warning('请选择营业状态')
    return
  }
  
  try {
    saving.value = true
    
    // 处理tags字段：后端期望的是字符串格式（JSON字符串），不是数组
    const submitForm: any = { ...form }
    if (tagsText.value && tagsText.value.trim()) {
      try {
        // 尝试解析为JSON，然后转换为JSON字符串
        const parsedTags = JSON.parse(tagsText.value)
        // 确保是数组格式，然后转换为JSON字符串
        if (Array.isArray(parsedTags)) {
          submitForm.tags = JSON.stringify(parsedTags)
        } else {
          // 如果不是数组，尝试转换为数组
          submitForm.tags = JSON.stringify([parsedTags])
        }
      } catch (e) {
        // 如果不是JSON格式，按逗号分隔转换为数组，再转为JSON字符串
        const tagsArray = tagsText.value.split(',').map(t => t.trim()).filter(t => t)
        submitForm.tags = JSON.stringify(tagsArray)
      }
    } else {
      // 如果为空，设置为空数组的JSON字符串
      submitForm.tags = '[]'
    }
    
    console.log('提交的商家数据:', submitForm)
    console.log('tags字段值:', submitForm.tags, '类型:', typeof submitForm.tags)
    
    const res = await api.merchantController.updateMyMerchant(submitForm)
    
    if (res.data?.code === 0) {
      message.success('保存成功')
      await loadMerchantInfo()
    } else {
      message.error(res.data?.message || '保存失败')
    }
  } catch (error: any) {
    console.error('保存商家信息失败:', error)
    message.error(error?.response?.data?.message || '保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadMerchantInfo()
})
</script>

<style scoped>
.merchant-settings-page {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 64px);
}
</style>

