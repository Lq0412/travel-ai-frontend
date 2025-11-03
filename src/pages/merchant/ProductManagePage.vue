<template>
  <div class="product-manage-page">
    <h2 style="margin-bottom: 16px">我的商品</h2>
    
    <a-form :model="searchParams" layout="inline" @finish="doSearch">
      <a-form-item label="商品名称">
        <a-input v-model:value="searchParams.name" allow-clear placeholder="输入商品名称" style="width: 200px" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="searchParams.status" allow-clear placeholder="选择状态" style="width: 120px">
          <a-select-option :value="1">上架</a-select-option>
          <a-select-option :value="0">下架</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="openAdd">新增商品</a-button>
      </a-form-item>
    </a-form>

    <div style="margin: 16px 0" />

    <a-table 
      :columns="columns" 
      :data-source="dataList" 
      :pagination="pagination" 
      :loading="loading"
      row-key="id" 
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'coverUrl'">
          <a-image :src="record.coverUrl" :width="80" :preview="false" />
        </template>
        <template v-else-if="column.dataIndex === 'price'">
          <span style="color: #f5222d; font-weight: bold">¥{{ record.price?.toFixed(2) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'stock'">
          <a-tag :color="record.stock > 0 ? 'green' : 'red'">{{ record.stock || 0 }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'orange'">
            {{ record.status === 1 ? '上架' : '下架' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除？删除后不可恢复" @confirm="doDelete(record.id)">
              <a-button danger type="link" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal 
      v-model:open="modalOpen" 
      :title="isEdit ? '编辑商品' : '新增商品'" 
      @ok="handleOk" 
      @cancel="handleCancel" 
      :confirm-loading="saving" 
      width="800px"
      :maskClosable="false"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="商品名称" required>
          <a-input v-model:value="form.name" placeholder="请输入商品名称" />
        </a-form-item>
        <a-form-item label="分类">
          <a-input v-model:value="form.category" placeholder="商品分类，如：美食、工艺品等" />
        </a-form-item>
        <a-form-item label="价格" required>
          <a-input-number 
            v-model:value="form.price" 
            :precision="2" 
            :min="0" 
            :step="0.01"
            style="width: 100%" 
            placeholder="商品价格"
          />
          <span style="margin-left: 8px; color: #999">元</span>
        </a-form-item>
        <a-form-item label="原价">
          <a-input-number 
            v-model:value="form.originalPrice" 
            :precision="2" 
            :min="0" 
            :step="0.01"
            style="width: 100%" 
            placeholder="原价（用于显示折扣）"
          />
          <span style="margin-left: 8px; color: #999">元</span>
        </a-form-item>
        <a-form-item label="封面图">
          <a-input v-model:value="form.coverUrl" placeholder="请输入图片URL" />
        </a-form-item>
        <a-form-item label="商品图集">
          <a-textarea 
            v-model:value="form.images" 
            :rows="3" 
            placeholder='JSON数组格式，如：["https://example.com/img1.jpg","https://example.com/img2.jpg"]'
          />
        </a-form-item>
        <a-form-item label="商品描述">
          <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入商品描述" />
        </a-form-item>
        <a-form-item label="规格参数">
          <a-textarea 
            v-model:value="form.specs" 
            :rows="3" 
            placeholder='JSON格式，如：{"重量":"500g","保质期":"30天"}'
          />
        </a-form-item>
        <a-form-item label="库存" required>
          <a-input-number v-model:value="form.stock" :min="0" style="width: 100%" placeholder="库存数量" />
        </a-form-item>
        <a-form-item label="商品重量(kg)">
          <a-input-number v-model:value="form.weight" :precision="2" :min="0" style="width: 100%" placeholder="用于计算运费" />
        </a-form-item>
        <a-form-item label="限购数量">
          <a-input-number v-model:value="form.limitPerUser" :min="0" style="width: 100%" placeholder="单个用户限购数量，0表示不限购" />
        </a-form-item>
        <a-form-item label="服务保障">
          <a-textarea v-model:value="form.serviceGuarantee" :rows="2" placeholder="服务保障内容，如：7天无理由退货、正品保证等" />
        </a-form-item>
        <a-form-item label="状态" required>
          <a-select v-model:value="form.status">
            <a-select-option :value="1">上架</a-select-option>
            <a-select-option :value="0">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否推荐">
          <a-select v-model:value="form.isRecommend">
            <a-select-option :value="1">推荐</a-select-option>
            <a-select-option :value="0">不推荐</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import api from '@/api'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '商品名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '封面图', dataIndex: 'coverUrl', width: 100 },
  { title: '分类', dataIndex: 'category', width: 120 },
  { title: '价格', dataIndex: 'price', width: 100 },
  { title: '库存', dataIndex: 'stock', width: 80 },
  { title: '销量', dataIndex: 'sales', width: 80 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' },
]

const dataList = ref<API.Product[]>([])
const total = ref(0)
const loading = ref(false)

const searchParams = reactive({
  current: 1,
  pageSize: 10,
  name: '',
  status: undefined as number | undefined,
})

const pagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
  pageSizeOptions: ['10', '20', '50', '100'],
}))

const fetchData = async () => {
  try {
    loading.value = true
    const params: any = {
      current: searchParams.current,
      pageSize: searchParams.pageSize,
    }
    // 将筛选条件传给后端
    if (searchParams.name) {
      params.name = searchParams.name
    }
    if (searchParams.status !== undefined) {
      params.status = searchParams.status
    }
    
    const res = await api.productController.merchantListProducts(params)
    
    if (res.data?.code === 0 && res.data.data) {
      dataList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    } else {
      // 特殊处理：如果不是商家
      if (res.data?.code === 40101 || res.data?.message?.includes('还不是商家')) {
        message.warning({
          content: '您还不是商家，请联系管理员创建商家信息。如需帮助，请联系系统管理员。',
          duration: 5,
        })
        // 可以跳转到首页或联系管理员页面
      } else {
        message.error(res.data?.message || '加载失败')
      }
    }
  } catch (error: any) {
    console.error('获取商品列表失败:', error)
    const errorMessage = error?.response?.data?.message || '加载失败，请稍后重试'
    
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

onMounted(() => {
  fetchData()
})

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
const form = reactive<API.Product>({
  status: 1,
  stock: 0,
  sales: 0,
  isRecommend: 0,
})

const openAdd = () => {
  isEdit.value = false
  // 逐个字段赋值，避免 Object.assign 导致的数字类型被错误处理
  form.id = undefined
  form.merchantId = undefined // 后端会自动设置
  form.name = ''
  form.category = ''
  form.price = undefined
  form.originalPrice = undefined
  form.coverUrl = ''
  form.images = ''
  form.description = ''
  form.specs = ''
  form.stock = 0
  form.sales = 0
  form.weight = undefined
  form.limitPerUser = undefined
  form.serviceGuarantee = ''
  form.status = 1
  form.isRecommend = 0
  modalOpen.value = true
}

const openEdit = (record: API.Product) => {
  isEdit.value = true
  Object.assign(form, {
    ...record,
    images: typeof record.images === 'string' ? record.images : JSON.stringify(record.images || []),
    specs: typeof record.specs === 'string' ? record.specs : JSON.stringify(record.specs || {}),
  })
  modalOpen.value = true
}

const handleOk = async () => {
  // 表单验证
  if (!form.name || form.name.trim() === '') {
    message.warning('请输入商品名称')
    return
  }
  if (!form.price || form.price <= 0) {
    message.warning('请输入正确的价格')
    return
  }
  if (form.stock === undefined || form.stock < 0) {
    message.warning('请输入正确的库存数量')
    return
  }
  
  try {
    saving.value = true
    
    // 处理images和specs字段
    const submitForm = { ...form }
    if (submitForm.images && typeof submitForm.images === 'string') {
      try {
        submitForm.images = JSON.parse(submitForm.images)
      } catch (e) {
        // 如果不是JSON格式，保持原样
      }
    }
    if (submitForm.specs && typeof submitForm.specs === 'string') {
      try {
        submitForm.specs = JSON.parse(submitForm.specs)
      } catch (e) {
        // 如果不是JSON格式，保持原样
      }
    }
    
    if (isEdit.value) {
      const res = await api.productController.merchantUpdateProduct(submitForm)
      if (res.data?.code === 0) {
        message.success('更新成功')
        modalOpen.value = false
        fetchData()
      } else {
        message.error(res.data?.message || '更新失败')
      }
    } else {
      const res = await api.productController.merchantAddProduct(submitForm)
      if (res.data?.code === 0) {
        message.success('新增成功')
        modalOpen.value = false
        fetchData()
      } else {
        message.error(res.data?.message || '新增失败')
      }
    }
  } catch (error: any) {
    console.error('保存商品失败:', error)
    message.error(error?.response?.data?.message || '保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  modalOpen.value = false
}

const doDelete = async (id?: number) => {
  if (!id) return
  
  try {
    const res = await api.productController.merchantDeleteProduct({ id })
    if (res.data?.code === 0) {
      message.success('删除成功')
      fetchData()
    } else {
      message.error(res.data?.message || '删除失败')
    }
  } catch (error: any) {
    console.error('删除商品失败:', error)
    message.error(error?.response?.data?.message || '删除失败，请稍后重试')
  }
}
</script>

<style scoped>
.product-manage-page {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 64px);
}
</style>

