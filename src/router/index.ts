import { createRouter, createWebHistory } from 'vue-router'
import UserLoginPage from '../pages/user/UserLoginPage.vue'
import UserRegisterPage from '../pages/user/UserRegisterPage.vue'
import UserManagePage from '../pages/admin/UserManagePage.vue'
import HomePage from '@/pages/HomePage.vue'
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
import MerchantLoginPage from '@/pages/merchant/MerchantLoginPage.vue'
import MerchantSettingsPage from '@/pages/merchant/MerchantSettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 用户端
    {
      path: '/',
      name: '首页',
      component: HomePage
    },{
      path: '/user/forum',
      name: '论坛',
      component: ForumPage
    },    {
      path: '/user/helper',
      name: 'AI助手',
      component: ChatPage
    },
    {
      path: '/user/shop',
      name: '商家列表',
      component: ShopListPage
    },
    {
      path: '/user/shop/:id',
      name: '商家店铺',
      component: ShopPage
    },
    {
      path: '/user/orders',
      name: '我的订单',
      component: OrderListPage
    },
    {
      path: '/user/orders/:orderId',
      name: '订单详情',
      component: OrderDetailPage
    },
    {
      path: '/user/cart',
      name: '购物车',
      component: CartPage
    },
    {
      path: '/product/:id',
      name: '商品详情',
      component: ProductDetailPage
    },
    {
      path: '/user/checkout',
      name: '确认订单',
      component: CheckoutPage
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage
    },
    {
      path: '/merchant/login',
      name: '商家登录',
      component: MerchantLoginPage
    },
    // 管理端的
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage
    },
    {
      path: '/admin/merchantManage',
      name: '商家管理',
      component: MerchantManagePage
    },
    {
      path: '/admin/productManage',
      name: '商品管理',
      component: ProductManagePage
    },
    {
      path: '/admin/userCreate',
      name: '创建用户',
      component: UserCreatePage
    },
    {
      path: '/admin/merchantCreate',
      name: '创建商家',
      component: MerchantCreatePage
    }
    ,
    {
      path: '/message-wall',
      name: '留言墙',
      component: MessageWallPage
    },
    {
      path: '/message-wall/:scenicSpotId',
      name: '留言墙展示',
      component: MessageWallDisplay
    },
    {
      path: '/admin/message-wall',
      name: '留言墙管理',
      component: AdminMessageWall
    },
    // 商家端路由
    {
      path: '/merchant/products',
      name: '我的商品',
      component: MerchantProductManagePage
    },
    {
      path: '/merchant/orders',
      name: '订单管理',
      component: MerchantOrderManagePage
    },
    {
      path: '/merchant/settings',
      name: '商家设置',
      component: MerchantSettingsPage
    }
  ]
})

export default router
