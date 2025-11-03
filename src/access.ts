import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

// 是否为首次获取登录用户
let firstFetchLoginUser = true;

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  // 如果目标路由和当前路由相同，允许导航（处理重复导航问题）
  if (to.path === from.path && to.name === from.name) {
    next()
    return
  }
  
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 确保页面刷新，首次加载时，能够等后端返回用户信息后再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false;
  }
  const toUrl = to.fullPath
  
  // 管理员路由权限校验
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('需要管理员权限')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  
  // 商家路由权限校验
  if (toUrl.startsWith('/merchant')) {
    if (!loginUser || (loginUser.userRole !== 'merchant' && loginUser.userRole !== 'admin')) {
      message.error('需要商家权限')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    
    // 注意：即使userRole是merchant，后端仍会检查merchant表中是否有对应记录
    // 如果没有记录，后端API会返回40101错误，前端会显示友好提示
  }
  
  next()
})
