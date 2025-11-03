# 工具函数使用指南

本目录包含项目中通用的工具函数和辅助类。

## 📁 文件说明

### errorHandler.ts - 错误处理工具

统一的错误处理工具，用于处理API请求、表单验证等各类错误。

#### 基础用法

```typescript
import { handleApiError } from '@/utils/errorHandler'

try {
  const res = await someApiCall()
  // 处理响应...
} catch (error) {
  // 统一错误处理：自动显示错误消息、处理401跳转等
  handleApiError(error)
}
```

#### 高级用法

```typescript
import { handleApiError, handleBusinessError, withErrorHandler } from '@/utils/errorHandler'

// 1. 自定义错误处理选项
try {
  const res = await someApiCall()
} catch (error) {
  handleApiError(error, {
    customMessage: '加载失败，请重试',
    showMessage: true,
    autoRedirectLogin: true,
    onError: (err) => {
      console.error('额外的错误处理', err)
    }
  })
}

// 2. 处理业务逻辑错误（code !== 0）
const res = await someApiCall()
if (handleBusinessError(res.data, '操作失败')) {
  // code === 0，操作成功
  message.success('操作成功')
} else {
  // code !== 0，已自动显示错误消息
}

// 3. 创建带错误处理的函数包装器
const loadData = withErrorHandler(async () => {
  const res = await fetchData()
  return res.data
}, {
  customMessage: '加载数据失败'
})

// 调用时自动处理错误
await loadData()
```

---

### logger.ts - 日志管理工具

智能日志管理工具，支持不同日志级别、自动环境检测、性能监控等。

#### 基础用法

```typescript
import { logger } from '@/utils/logger'

// DEBUG级别（仅开发环境）
logger.debug('调试信息', { userId: 123 })

// INFO级别
logger.info('用户登录成功', userData)

// WARN级别
logger.warn('库存不足')

// ERROR级别（始终记录）
logger.error('API请求失败', error)
```

#### 创建模块专用logger

```typescript
import { createLogger } from '@/utils/logger'

// 创建带模块前缀的logger
const moduleLogger = createLogger('MessageWall')

moduleLogger.debug('加载留言列表')
// 输出: [HH:mm:ss.ms] [DEBUG] [MessageWall] 加载留言列表

moduleLogger.error('加载失败', error)
// 输出: [HH:mm:ss.ms] [ERROR] [MessageWall] 加载失败
```

#### 组件中使用

```typescript
import { createComponentLogger } from '@/utils/logger'

// 在Vue组件中
const componentLogger = createComponentLogger('MessageWallDisplay')

onMounted(() => {
  componentLogger.info('组件已挂载')
})

const loadMessages = async () => {
  try {
    componentLogger.debug('开始加载留言')
    const res = await api.getMessages()
    componentLogger.info('加载成功', { count: res.data.length })
  } catch (error) {
    componentLogger.error('加载失败', error)
  }
}
```

#### 性能监控

```typescript
import { measurePerformance, perfLogger } from '@/utils/logger'

// 自动记录执行时间
const data = await measurePerformance('加载留言列表', async () => {
  return await api.getMessages()
})
// 输出: [Performance] 加载留言列表 完成，耗时: 152.34ms

// 手动记录性能
perfLogger.debug('开始渲染大量数据')
const startTime = performance.now()
// ... 执行操作
const duration = performance.now() - startTime
perfLogger.debug(`渲染完成，耗时: ${duration.toFixed(2)}ms`)
```

#### 预定义的logger

```typescript
import { apiLogger, perfLogger, devLogger } from '@/utils/logger'

// API专用logger
apiLogger.debug('POST /api/messages', params)

// 性能logger
perfLogger.debug('首屏加载完成', { duration: 1234 })

// 开发环境专用（生产环境自动禁用）
devLogger.debug('这条日志只在开发环境显示')
```

---

## 🔧 在组件中的完整示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { handleApiError, handleBusinessError } from '@/utils/errorHandler'
import { createComponentLogger } from '@/utils/logger'
import { MESSAGE_WALL } from '@/constants'
import { messageWallApi } from '@/api/messageWallApi'

const logger = createComponentLogger('MessageWallDisplay')
const messages = ref<Message[]>([])
const loading = ref(false)

// 加载留言列表
const loadMessages = async () => {
  loading.value = true
  logger.debug('开始加载留言列表')
  
  try {
    const res = await messageWallApi.listMessages({
      scenicSpotId: MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID,
      pageSize: MESSAGE_WALL.PAGE_SIZE
    })
    
    // 处理业务逻辑错误
    if (handleBusinessError(res.data, '获取留言列表失败')) {
      messages.value = res.data.data?.records || []
      logger.info('加载成功', { count: messages.value.length })
    }
  } catch (error) {
    // 统一错误处理
    handleApiError(error, {
      customMessage: '加载留言失败，请稍后重试'
    })
    logger.error('加载留言失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  logger.info('组件已挂载')
  loadMessages()
})
</script>
```

---

## 📚 最佳实践

### ✅ 推荐做法

1. **使用logger替代console.log**
```typescript
// ❌ 不推荐
console.log('用户ID:', userId)

// ✅ 推荐
logger.debug('用户ID:', userId)
```

2. **创建模块专用logger**
```typescript
// ✅ 每个模块创建自己的logger
const logger = createLogger('ModuleName')
```

3. **使用handleApiError统一处理错误**
```typescript
// ✅ 统一错误处理
try {
  await api.call()
} catch (error) {
  handleApiError(error)
}
```

4. **使用常量而非硬编码**
```typescript
// ❌ 不推荐
if (res.data.code === 0) { }

// ✅ 推荐
import { API_CONSTANTS } from '@/constants'
if (res.data.code === API_CONSTANTS.SUCCESS_CODE) { }
```

### ❌ 避免做法

1. 不要在生产环境保留大量console.log
2. 不要重复定义错误处理逻辑
3. 不要硬编码错误消息和状态码
4. 不要忽略错误处理

---

## 🔄 迁移现有代码

### 迁移步骤

1. **替换console.log**
```typescript
// 之前
console.log('[留言墙] 加载留言')

// 之后
import { createLogger } from '@/utils/logger'
const logger = createLogger('MessageWall')
logger.debug('加载留言')
```

2. **替换错误处理**
```typescript
// 之前
catch (error: any) {
  const errorMsg = error?.response?.data?.message || '未知错误'
  message.error('加载失败: ' + errorMsg)
}

// 之后
import { handleApiError } from '@/utils/errorHandler'
catch (error) {
  handleApiError(error, { customMessage: '加载失败' })
}
```

3. **替换硬编码常量**
```typescript
// 之前
return 6 // 默认从化温泉

// 之后
import { MESSAGE_WALL } from '@/constants'
return MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID
```

---

## 📖 相关文档

- [常量配置使用指南](../constants/README.md)
- [API层使用指南](../api/README.md)
- [TypeScript类型定义](../types/README.md)

