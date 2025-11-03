# 常量配置使用指南

本目录包含项目中所有的常量定义，统一管理魔法数字、状态码、配置项等。

## 📋 常量分类

### API_CONSTANTS - API相关常量
```typescript
import { API_CONSTANTS } from '@/constants'

API_CONSTANTS.SUCCESS_CODE        // 0 - 响应成功码
API_CONSTANTS.SUCCESS_CODE_ALT     // 200 - 响应成功码（备用）
API_CONSTANTS.TIMEOUT              // 30000 - 请求超时时间（毫秒）
```

### HTTP_STATUS - HTTP状态码
```typescript
import { HTTP_STATUS } from '@/constants'

HTTP_STATUS.OK                     // 200
HTTP_STATUS.UNAUTHORIZED           // 401
HTTP_STATUS.FORBIDDEN              // 403
HTTP_STATUS.NOT_FOUND              // 404
HTTP_STATUS.INTERNAL_SERVER_ERROR  // 500
```

### BUSINESS_CODE - 业务错误码
```typescript
import { BUSINESS_CODE } from '@/constants'

BUSINESS_CODE.SUCCESS              // 0
BUSINESS_CODE.NOT_LOGIN            // 40100
BUSINESS_CODE.NO_AUTH              // 40101
BUSINESS_CODE.SYSTEM_ERROR         // 50000
```

### USER_ROLE - 用户角色
```typescript
import { USER_ROLE } from '@/constants'

USER_ROLE.USER                     // 'user'
USER_ROLE.MERCHANT                 // 'merchant'
USER_ROLE.ADMIN                    // 'admin'
```

### MESSAGE_WALL - 留言墙相关常量
```typescript
import { MESSAGE_WALL } from '@/constants'

// 基础配置
MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID    // 6 - 默认景点ID
MESSAGE_WALL.MAX_MESSAGE_LENGTH        // 200 - 留言最大长度
MESSAGE_WALL.REFRESH_INTERVAL          // 10000 - 刷新间隔（毫秒）
MESSAGE_WALL.PAGE_SIZE                 // 100 - 每页显示数

// 留言状态
MESSAGE_WALL.STATUS.PENDING            // 0 - 待审核
MESSAGE_WALL.STATUS.APPROVED           // 1 - 已通过
MESSAGE_WALL.STATUS.REJECTED           // 2 - 已拒绝

// 弹幕配置
MESSAGE_WALL.BARRAGE.ROW_HEIGHT        // 40 - 行高
MESSAGE_WALL.BARRAGE.MIN_DURATION      // 5 - 最小动画时长
MESSAGE_WALL.BARRAGE.MAX_DURATION      // 20 - 最大动画时长
MESSAGE_WALL.BARRAGE.DEFAULT_FONT_SIZE // 14 - 默认字体大小
MESSAGE_WALL.BARRAGE.DEFAULT_COLOR     // '#fff' - 默认颜色
```

### STORAGE_KEYS - 本地存储键名
```typescript
import { STORAGE_KEYS } from '@/constants'

STORAGE_KEYS.TOKEN                 // 'token'
STORAGE_KEYS.USER_INFO             // 'userInfo'
STORAGE_KEYS.SCENIC_SPOT_ID        // 'scenic_spot_id'
STORAGE_KEYS.THEME                 // 'theme'
STORAGE_KEYS.LANGUAGE              // 'language'
```

### ROUTES - 路由路径
```typescript
import { ROUTES } from '@/constants'

ROUTES.HOME                        // '/'
ROUTES.USER_LOGIN                  // '/user/login'
ROUTES.MESSAGE_WALL                // '/message-wall'
ROUTES.MESSAGE_WALL_DETAIL(6)      // '/message-wall/6' - 动态路由
```

### DEFAULT_IMAGES - 默认图片
```typescript
import { DEFAULT_IMAGES } from '@/constants'

DEFAULT_IMAGES.BACKGROUND          // 默认背景图
DEFAULT_IMAGES.USER_AVATAR         // 默认用户头像
DEFAULT_IMAGES.SCENIC_COVER        // 默认景点封面
```

### PAGINATION - 分页配置
```typescript
import { PAGINATION } from '@/constants'

PAGINATION.DEFAULT_CURRENT         // 1
PAGINATION.DEFAULT_PAGE_SIZE       // 10
PAGINATION.PAGE_SIZE_OPTIONS       // ['10', '20', '50', '100']
```

### ORDER_STATUS & PRODUCT_STATUS - 订单和商品状态
```typescript
import { ORDER_STATUS, PRODUCT_STATUS } from '@/constants'

ORDER_STATUS.PENDING_PAYMENT       // 0 - 待支付
ORDER_STATUS.PAID                  // 1 - 已支付
ORDER_STATUS.COMPLETED             // 3 - 已完成

PRODUCT_STATUS.OFF_SHELF           // 0 - 下架
PRODUCT_STATUS.ON_SHELF            // 1 - 上架
```

### ENV - 环境变量
```typescript
import { ENV } from '@/constants'

ENV.MODE                           // 当前环境
ENV.IS_DEV                         // 是否开发环境
ENV.IS_PROD                        // 是否生产环境
```

---

## 🔧 使用示例

### 替换硬编码数字

```typescript
// ❌ 不推荐 - 硬编码
if (response.code === 0) {
  // ...
}

// ✅ 推荐 - 使用常量
import { API_CONSTANTS } from '@/constants'
if (response.code === API_CONSTANTS.SUCCESS_CODE) {
  // ...
}
```

### 替换硬编码字符串

```typescript
// ❌ 不推荐
localStorage.setItem('scenic_spot_id', '6')

// ✅ 推荐
import { STORAGE_KEYS, MESSAGE_WALL } from '@/constants'
localStorage.setItem(
  STORAGE_KEYS.SCENIC_SPOT_ID, 
  String(MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID)
)
```

### 状态判断

```typescript
// ❌ 不推荐
if (message.status === 1) {
  // 已通过
}

// ✅ 推荐
import { MESSAGE_WALL } from '@/constants'
if (message.status === MESSAGE_WALL.STATUS.APPROVED) {
  // 已通过
}
```

### 路由跳转

```typescript
// ❌ 不推荐
router.push('/user/login')

// ✅ 推荐
import { ROUTES } from '@/constants'
router.push(ROUTES.USER_LOGIN)
```

### 动态路由

```typescript
// ✅ 使用动态路由函数
import { ROUTES } from '@/constants'
const scenicSpotId = 6
router.push(ROUTES.MESSAGE_WALL_DETAIL(scenicSpotId))
// 跳转到: /message-wall/6
```

---

## 📚 完整示例：留言墙组件

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  MESSAGE_WALL, 
  STORAGE_KEYS, 
  DEFAULT_IMAGES 
} from '@/constants'
import { createComponentLogger } from '@/utils/logger'

const logger = createComponentLogger('MessageWall')

// 使用常量作为默认值
const scenicSpotId = ref(MESSAGE_WALL.DEFAULT_SCENIC_SPOT_ID)
const messages = ref<Message[]>([])
const content = ref('')
const backgroundUrl = ref(DEFAULT_IMAGES.BACKGROUND)

// 从localStorage获取景点ID
const loadScenicSpotId = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SCENIC_SPOT_ID)
  if (stored && !isNaN(Number(stored))) {
    scenicSpotId.value = Number(stored)
  }
  logger.debug('景点ID:', scenicSpotId.value)
}

// 保存景点ID到localStorage
const saveScenicSpotId = (id: number) => {
  localStorage.setItem(STORAGE_KEYS.SCENIC_SPOT_ID, String(id))
}

// 验证留言内容
const validateMessage = (): boolean => {
  if (!content.value.trim()) {
    message.warning('请输入留言内容')
    return false
  }
  
  if (content.value.length > MESSAGE_WALL.MAX_MESSAGE_LENGTH) {
    message.warning(`留言内容不能超过${MESSAGE_WALL.MAX_MESSAGE_LENGTH}字`)
    return false
  }
  
  return true
}

// 获取留言状态文本
const getStatusText = (status: number): string => {
  switch (status) {
    case MESSAGE_WALL.STATUS.PENDING:
      return '待审核'
    case MESSAGE_WALL.STATUS.APPROVED:
      return '已通过'
    case MESSAGE_WALL.STATUS.REJECTED:
      return '已拒绝'
    default:
      return '未知'
  }
}

// 定时刷新
let timer: number | null = null

onMounted(() => {
  loadScenicSpotId()
  loadMessages()
  
  // 使用常量配置定时器
  timer = window.setInterval(
    loadMessages, 
    MESSAGE_WALL.REFRESH_INTERVAL
  )
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
```

---

## ✅ 最佳实践

1. **优先使用常量**：任何可能重复使用的值都应该定义为常量
2. **语义化命名**：常量名称要清晰表达其含义
3. **分类管理**：相关的常量归类到同一个对象中
4. **类型安全**：使用 `as const` 确保常量不可修改
5. **避免重复**：检查是否已有相同含义的常量再添加新常量

## ❌ 避免做法

1. ❌ 不要在代码中直接使用魔法数字和字符串
2. ❌ 不要在多个文件中重复定义相同的常量
3. ❌ 不要使用不明确的常量名（如 `STATUS_1`, `CODE_0`）

---

## 🔄 如何添加新常量

1. 在 `src/constants/index.ts` 中找到合适的分类
2. 如果没有合适的分类，创建新的常量对象
3. 添加清晰的注释说明常量的用途
4. 使用 `as const` 确保类型安全
5. 在本文档中更新说明

示例：
```typescript
/**
 * 新功能相关常量
 */
export const NEW_FEATURE = {
  /** 功能开关 */
  ENABLED: true,
  /** 最大数量 */
  MAX_COUNT: 100,
} as const
```

