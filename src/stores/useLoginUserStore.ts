import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUser } from '@/api/userController'

//存储登录用户信息状态，并提供获取和设置登录用户信息的方法
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    try {
      console.log('开始获取登录用户信息')
      const res = await getLoginUser()
      console.log('获取用户信息响应:', res)
      console.log('响应数据:', res.data)
      console.log('响应code:', res.data?.code)
      console.log('响应data:', res.data?.data)

      // 兼容不同的code值（0或200都表示成功）
      const isSuccess = (res.data.code === 0 || res.data.code === 200)
      
      if (isSuccess && res.data.data) {
        loginUser.value = res.data.data
        console.log('用户信息已更新:', loginUser.value)
        console.log('用户ID:', loginUser.value.id)
        console.log('用户名:', loginUser.value.userName)
      } else {
        console.log('获取用户信息失败 - code:', res.data?.code, 'message:', res.data?.message || '未知错误')
        // 如果获取失败，清除登录状态
        loginUser.value = {
          userName: '未登录',
        }
      }
    } catch (error: any) {
      console.error('获取用户信息时发生错误:', error)
      // 如果请求失败（如401），清除登录状态
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('用户未登录，清除登录状态')
        loginUser.value = {
          userName: '未登录',
        }
      }
    }
  }

  /**
   * 设置登录用户
   */
  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})


