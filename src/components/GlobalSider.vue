<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser?.id"
      :collapsed="collapsed"
      :width="200"
      :collapsedWidth="80"
      :trigger="null"
      collapsible
    >
      <div class="sider-header">
        <div class="logo" v-if="!collapsed">
<!--          <span>系统名称</span>-->
        </div>
        <div class="logo-collapsed" v-else>
<!--          <span>简</span>-->
        </div>
      </div>
      <div class="logo-section">
        <router-link to="/" class="logo" title="智旅">
          智旅
        </router-link>
      </div>

      <a-menu
        v-model:selectedKeys="current"
        :items="menuItems"
        mode="inline"
        @click="doMenuClick"
        :inlineCollapsed="collapsed"
      />

      <div class="collapse-button" @click="$emit('toggle-collapse')">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </div>
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { TeamOutlined, UserOutlined, ShopOutlined, ShoppingCartOutlined, MenuUnfoldOutlined, MenuFoldOutlined, FileTextOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const current = ref<string[]>([])

defineProps({
  collapsed: Boolean
})

// 通用菜单项（所有角色都可见）
const commonMenuItems = [
  {
    key: '/',
    icon: () => h(UserOutlined),
    label: '首页',
  },
  {
    key: '/message-wall',
    label: '留言墙',
    icon: () => h(TeamOutlined),
  },
  {
    key: '/user/forum',
    label: '论坛',
    icon: () => h(TeamOutlined),
  },
  {
    key: '/user/helper',
    label: 'AI助手',
    icon: () => h(TeamOutlined),
  },
]

// 用户端专用菜单项（普通用户可见）
const userMenuItems = [
  {
    key: '/user/shop',
    label: '商家店铺',
    icon: () => h(ShopOutlined),
  },
  {
    key: '/user/cart',
    label: '购物车',
    icon: () => h(ShoppingCartOutlined),
  },
  {
    key: '/user/orders',
    label: '我的订单',
    icon: () => h(FileTextOutlined),
  },
]

// 商家专用菜单项
const merchantMenuItems = [
  {
    key: '/merchant/products',
    label: '我的商品',
    icon: () => h(AppstoreOutlined),
  },
  {
    key: '/merchant/orders',
    label: '订单管理',
    icon: () => h(UnorderedListOutlined),
  },
  {
    key: '/merchant/settings',
    label: '商家设置',
    icon: () => h(UserOutlined),
  },
]

// 管理员专用菜单项
const adminMenuItems = [
  {
    key: '/admin/userManage',
    label: '用户管理',
    icon: () => h(TeamOutlined),
  },
  {
    key: '/admin/merchantManage',
    label: '商家管理',
    icon: () => h(ShopOutlined),
  },
  {
    key: '/admin/productManage',
    label: '商品管理',
    icon: () => h(ShopOutlined),
  },
  {
    key: '/admin/message-wall',
    label: '留言墙管理',
    icon: () => h(TeamOutlined),
  },
]

// 根据用户角色动态生成菜单
const menuItems = computed(() => {
  const loginUser = loginUserStore.loginUser
  const userRole = loginUser?.userRole
  
  let items = [...commonMenuItems] // 从通用菜单开始
  
  // 根据角色添加不同的菜单
  if (userRole === 'merchant') {
    // 商家：只显示通用菜单 + 商家管理菜单（不显示购物车、我的订单等用户端菜单）
    items = [...items, ...merchantMenuItems]
  } else if (userRole === 'admin') {
    // 管理员：显示通用菜单 + 用户端菜单 + 商家菜单 + 管理菜单
    items = [...items, ...userMenuItems, ...merchantMenuItems, ...adminMenuItems]
  } else {
    // 普通用户：显示通用菜单 + 用户端菜单
    items = [...items, ...userMenuItems]
  }
  
  return items
})

const setSelectedKeyByRoute = (to: { path: string }) => {
  const path = to.path as string
  // 处理留言墙展示页路由，匹配时选中留言墙菜单项
  if (path.startsWith('/message-wall/')) {
    current.value = ['/message-wall']
  } else if (path.startsWith('/merchant/orders/')) {
    // 商家订单详情页，选中订单管理菜单
    current.value = ['/merchant/orders']
  } else if (path.startsWith('/user/orders/')) {
    // 用户订单详情页，选中我的订单菜单
    current.value = ['/user/orders']
  } else if (path.startsWith('/user/shop/')) {
    // 商家店铺详情页，选中商家店铺菜单
    current.value = ['/user/shop']
  } else {
    current.value = [path]
  }
}

setSelectedKeyByRoute(router.currentRoute.value)

router.afterEach((to) => {
  setSelectedKeyByRoute(to)
})

const doMenuClick = ({ key }: { key: string }) => {
  const currentPath = router.currentRoute.value.path
  
  // 如果是相同的路径，尝试强制刷新页面内容
  if (currentPath === key) {
    // 通过 replace 触发路由更新
    router.replace({ path: key, query: { _t: Date.now() } }).then(() => {
      // 移除临时查询参数
      router.replace({ path: key })
    }).catch(() => {
      // 忽略错误
    })
    return
  }
  
  // 使用 push 进行路由跳转
  router.push(key).catch((err) => {
    // 处理导航重复错误
    if (err.name === 'NavigationDuplicated' || err.message?.includes('duplicate') || err.message?.includes('重复')) {
      // 如果是重复导航，说明路由已经更新，忽略错误
      console.debug('导航重复，已忽略:', key)
    } else {
      console.error('路由跳转失败:', err)
      // 尝试使用 replace 作为备选方案
      router.replace(key).catch(() => {
        console.warn('路由跳转完全失败:', key)
      })
    }
  })
}
</script>

<style scoped>
#globalSider {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
  height: 100vh;
}

#globalSider .ant-layout-sider {
  height: 100%;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  transition: all 0.2s ease;
}

.sider-header {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.logo-collapsed {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.collapse-button {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-top: 1px solid #f0f0f0;
}

.collapse-button:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.ant-menu {
  border-right: none;
}

/* 修改Logo区域样式 */
.logo-section {
  margin-bottom: 60px;
  position: fixed;
  left: 20px;
  top: 0;
  z-index: 1001;
  height: 64px;
  display: flex;
  align-items: center;
}
</style>
