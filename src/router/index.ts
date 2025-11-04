import { createRouter, createWebHistory } from 'vue-router'
import UserLoginPage from '../pages/user/UserLoginPage.vue'
import UserRegisterPage from '../pages/user/UserRegisterPage.vue'
import UserManagePage from '../pages/admin/UserManagePage.vue'
import HomePage from '@/pages/HomePage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ChatPage from '@/pages/user/ChatPage.vue'
import ForumPage from '@/pages/user/ForumPage.vue'
import ShopPage from '@/pages/user/ShopPage.vue'
import ShopListPage from '@/pages/user/ShopListPage.vue'
import OrderListPage from '@/pages/user/OrderListPage.vue'
import CartPage from '@/pages/user/CartPage.vue'
import ProductDetailPage from '@/pages/user/ProductDetailPage.vue'
import CheckoutPage from '@/pages/user/CheckoutPage.vue'
import OrderDetailPage from '@/pages/user/OrderDetailPage.vue'
import MerchantManagePage from '@/pages/admin/MerchantManagePage.vue'
import ProductManagePage from '@/pages/admin/ProductManagePage.vue'
import UserCreatePage from '@/pages/admin/UserCreatePage.vue'
import MerchantCreatePage from '@/pages/admin/MerchantCreatePage.vue'
import MessageWallDisplay from '@/pages/MessageWallDisplay.vue'
import MessageWallPage from '@/pages/MessageWallPage.vue'
import AdminMessageWall from '@/pages/admin/AdminMessageWall.vue'
import MerchantProductManagePage from '@/pages/merchant/ProductManagePage.vue'
import MerchantOrderManagePage from '@/pages/merchant/OrderManagePage.vue'
import MerchantSettingsPage from '@/pages/merchant/MerchantSettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 公共页面
    {
      path: '/',
      name: '首页',
      component: HomePage,
      meta: { layout: 'landing' } // 使用全屏 Landing 布局
    },
    {
      path: '/dashboard',
      name: '仪表板',
      component: DashboardPage,
      meta: { layout: 'topnav' } // 使用顶部导航布局
    },
    // 用户端
    {
      path: '/user/forum',
      name: '论坛',
      component: ForumPage,
      meta: { layout: 'topnav' }
    },    {
      path: '/user/helper',
      name: 'AI助手',
      component: ChatPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/shop',
      name: '商家列表',
      component: ShopListPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/shop/:id',
      name: '商家店铺',
      component: ShopPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/orders',
      name: '我的订单',
      component: OrderListPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/orders/:orderId',
      name: '订单详情',
      component: OrderDetailPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/cart',
      name: '购物车',
      component: CartPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/product/:id',
      name: '商品详情',
      component: ProductDetailPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/checkout',
      name: '确认订单',
      component: CheckoutPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
      meta: { layout: 'none' } // 无布局，全屏登录页
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
      meta: { layout: 'none' } // 无布局，全屏注册页
    },
    // 管理端的
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/admin/merchantManage',
      name: '商家管理',
      component: MerchantManagePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/admin/productManage',
      name: '商品管理',
      component: ProductManagePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/admin/userCreate',
      name: '创建用户',
      component: UserCreatePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/admin/merchantCreate',
      name: '创建商家',
      component: MerchantCreatePage,
      meta: { layout: 'topnav' }
    }
    ,
    {
      path: '/message-wall',
      name: '留言墙',
      component: MessageWallPage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/message-wall/:scenicSpotId',
      name: '留言墙展示',
      component: MessageWallDisplay,
      meta: { layout: 'topnav' }
    },
    {
      path: '/admin/message-wall',
      name: '留言墙管理',
      component: AdminMessageWall,
      meta: { layout: 'topnav' }
    },
    // 商家端路由
    {
      path: '/merchant/products',
      name: '我的商品',
      component: MerchantProductManagePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/merchant/orders',
      name: '订单管理',
      component: MerchantOrderManagePage,
      meta: { layout: 'topnav' }
    },
    {
      path: '/merchant/settings',
      name: '商家设置',
      component: MerchantSettingsPage,
      meta: { layout: 'topnav' }
    }
  ]
})

export default router
