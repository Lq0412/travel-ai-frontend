<template>
  <div class="product-manage-page">
    <a-form :model="searchParams" layout="inline" @finish="doSearch">
      <a-form-item label="商品名称">
        <a-input v-model:value="searchParams.name" allow-clear placeholder="输入商品名称" />
      </a-form-item>
      <a-form-item label="商家ID">
        <a-input-number v-model:value="searchParams.merchantId" allow-clear placeholder="商家ID" style="width: 200px" />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="openAdd">新增商品</a-button>
      </a-form-item>
    </a-form>

    <div style="margin: 16px 0" />

    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" row-key="id" @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'coverUrl'">
          <a-image :src="record.coverUrl" :width="80" />
        </template>
        <template v-else-if="column.dataIndex === 'price'">
          <span>¥{{ record.price?.toFixed(2) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'stock'">
          <a-tag :color="record.stock > 0 ? 'green' : 'red'">{{ record.stock || 0 }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'orange'">{{ record.status === 1 ? '上架' : '下架' }}</a-tag>
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

    <a-modal v-model:open="modalOpen" :title="isEdit ? '编辑商品' : '新增商品'" @ok="handleOk" @cancel="handleCancel" :confirm-loading="saving" width="800px">
      <a-form :model="form" label-col="{ span: 6 }" wrapper-col="{ span: 18 }">
        <a-form-item label="商品名称"><a-input v-model:value="form.name" /></a-form-item>
        <a-form-item label="所属商家"><a-input-number v-model:value="form.merchantId" style="width: 100%" /></a-form-item>
        <a-form-item label="分类">
          <a-input v-model:value="form.category" placeholder="商品分类" />
        </a-form-item>
        <a-form-item label="价格"><a-input-number v-model:value="form.price" :precision="2" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="原价"><a-input-number v-model:value="form.originalPrice" :precision="2" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="封面图"><a-input v-model:value="form.coverUrl" placeholder="图片URL" /></a-form-item>
        <a-form-item label="商品图集">
          <a-textarea v-model:value="form.images" :rows="2" placeholder="JSON数组格式：['url1','url2']" />
        </a-form-item>
        <a-form-item label="商品描述"><a-textarea v-model:value="form.description" :rows="3" /></a-form-item>
        <a-form-item label="规格参数">
          <a-textarea v-model:value="form.specs" :rows="2" placeholder="JSON格式：{'key':'value'}" />
        </a-form-item>
        <a-form-item label="库存"><a-input-number v-model:value="form.stock" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="销量"><a-input-number v-model:value="form.sales" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="商品重量(kg)"><a-input-number v-model:value="form.weight" :precision="2" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="限购数量"><a-input-number v-model:value="form.limitPerUser" :min="0" style="width: 100%" /></a-form-item>
        <a-form-item label="服务保障">
          <a-textarea v-model:value="form.serviceGuarantee" :rows="2" placeholder="服务保障内容" />
        </a-form-item>
        <a-form-item label="状态">
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
  { title: '商品名称', dataIndex: 'name', width: 150 },
  { title: '商家ID', dataIndex: 'merchantId', width: 100 },
  { title: '分类', dataIndex: 'category', width: 100 },
  { title: '封面图', dataIndex: 'coverUrl', width: 100 },
  { title: '价格', dataIndex: 'price', width: 100 },
  { title: '库存', dataIndex: 'stock', width: 80 },
  { title: '销量', dataIndex: 'sales', width: 80 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' },
]

const dataList = ref<API.Product[]>([])
const total = ref(0)

const searchParams = reactive({
  current: 1,
  pageSize: 10,
  name: '',
  merchantId: undefined as number | undefined,
})

const pagination = computed(() => ({
  current: searchParams.current,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const fetchData = async () => {
  try {
    const params = {
      current: searchParams.current,
      pageSize: searchParams.pageSize,
    }
    const res = await api.productController.adminListProducts(params)
    if (res.data?.code === 0 && res.data.data) {
      dataList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
      
      // 客户端筛选
      let filteredList = [...dataList.value]
      if (searchParams.name) {
        filteredList = filteredList.filter(item => item.name?.includes(searchParams.name))
      }
      if (searchParams.merchantId) {
        filteredList = filteredList.filter(item => item.merchantId === searchParams.merchantId)
      }
      
      dataList.value = filteredList
    } else {
      message.error(res.data?.message || '加载失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    message.error('加载失败')
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
const form = reactive<API.Product>({
  status: 1,
  stock: 0,
  sales: 0,
  isRecommend: 0,
})

const openAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: undefined,
    merchantId: undefined,
    name: '',
    category: '',
    price: undefined,
    originalPrice: undefined,
    coverUrl: '',
    images: '',
    description: '',
    specs: '',
    stock: 0,
    sales: 0,
    weight: undefined,
    limitPerUser: undefined,
    serviceGuarantee: '',
    status: 1,
    isRecommend: 0,
  })
  modalOpen.value = true
}

const openEdit = (record: API.Product) => {
  isEdit.value = true
  Object.assign(form, record)
  modalOpen.value = true
}

const handleOk = async () => {
  if (!form.name) {
    message.warning('请输入商品名称')
    return
  }
  if (!form.merchantId) {
    message.warning('请输入商家ID')
    return
  }
  if (!form.price || form.price <= 0) {
    message.warning('请输入正确的价格')
    return
  }
  
  try {
    saving.value = true
    if (isEdit.value) {
      const res = await api.productController.adminUpdateProduct(form)
      if (res.data?.code === 0) {
        message.success('更新成功')
        modalOpen.value = false
        fetchData()
      } else {
        message.error(res.data?.message || '更新失败')
      }
    } else {
      const res = await api.productController.adminAddProduct(form)
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

const handleCancel = () => {
  modalOpen.value = false
}

const doDelete = async (id?: number) => {
  if (!id) return
  const res = await api.productController.adminDeleteProduct({ id })
  if (res.data?.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error(res.data?.message || '删除失败')
  }
}
</script>

<style scoped>
.product-manage-page {
  padding: 16px;
}
</style>

