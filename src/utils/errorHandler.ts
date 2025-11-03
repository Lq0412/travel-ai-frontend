import { message } from 'ant-design-vue'
import router from '@/router'
import type { AxiosError } from 'axios'

/**
 * API错误响应接口
 */
interface ApiErrorResponse {
  code?: number
  message?: string
  data?: any
}

/**
 * 错误处理选项
 */
interface ErrorHandlerOptions {
  /** 是否显示错误提示，默认true */
  showMessage?: boolean
  /** 自定义错误消息 */
  customMessage?: string
  /** 是否自动处理401跳转登录，默认true */
  autoRedirectLogin?: boolean
  /** 错误回调函数 */
  onError?: (error: any) => void
}

/**
 * 统一错误处理函数
 * @param error 错误对象
 * @param options 错误处理选项
 * @returns 错误消息
 */
export function handleApiError(
  error: any,
  options: ErrorHandlerOptions = {}
): string {
  const {
    showMessage: shouldShowMessage = true,
    customMessage,
    autoRedirectLogin = true,
    onError
  } = options

  let errorMessage = customMessage || '操作失败，请稍后重试'
  let statusCode: number | undefined

  // 解析错误信息
  if (error?.response) {
    // Axios错误响应
    const axiosError = error as AxiosError<ApiErrorResponse>
    statusCode = axiosError.response?.status
    const responseData = axiosError.response?.data

    if (responseData?.message) {
      errorMessage = responseData.message
    } else if (axiosError.message) {
      errorMessage = axiosError.message
    }
  } else if (error?.data) {
    // 直接的响应数据
    const responseData = error.data as ApiErrorResponse
    statusCode = responseData.code
    errorMessage = responseData.message || errorMessage
  } else if (error?.message) {
    // 普通错误对象
    errorMessage = error.message
  } else if (typeof error === 'string') {
    // 字符串错误
    errorMessage = error
  }

  // 处理特定状态码
  if (statusCode === 401 || statusCode === 40100) {
    errorMessage = '请先登录'
    if (autoRedirectLogin) {
      // 跳转到登录页，保存当前路径用于登录后返回
      const currentPath = window.location.pathname + window.location.search
      router.push({
        path: '/user/login',
        query: { redirect: currentPath }
      })
    }
  } else if (statusCode === 403 || statusCode === 40300) {
    errorMessage = '没有权限访问'
  } else if (statusCode === 404 || statusCode === 40400) {
    errorMessage = customMessage || '请求的资源不存在'
  } else if (statusCode === 500 || statusCode === 50000) {
    errorMessage = customMessage || '服务器错误，请稍后重试'
  }

  // 显示错误提示
  if (shouldShowMessage && statusCode !== 401) {
    // 401错误由自动跳转处理，不再显示消息
    message.error(errorMessage)
  }

  // 执行错误回调
  if (onError) {
    onError(error)
  }

  return errorMessage
}

/**
 * 处理表单验证错误
 * @param error 验证错误对象
 */
export function handleValidationError(error: any): void {
  if (error?.errorFields && Array.isArray(error.errorFields)) {
    const firstError = error.errorFields[0]
    if (firstError?.errors && firstError.errors.length > 0) {
      message.warning(firstError.errors[0])
    }
  } else {
    message.warning('请检查表单输入')
  }
}

/**
 * 业务逻辑错误处理（用于处理code不为0的情况）
 * @param response API响应对象
 * @param defaultMessage 默认错误消息
 * @returns 是否成功（code === 0）
 */
export function handleBusinessError(
  response: { code?: number; message?: string; data?: any },
  defaultMessage = '操作失败'
): boolean {
  if (response.code === 0 || response.code === 200) {
    return true
  }

  const errorMessage = response.message || defaultMessage
  
  // 特殊错误码处理
  if (response.code === 401 || response.code === 40100) {
    message.warning('请先登录')
    const currentPath = window.location.pathname + window.location.search
    router.push({
      path: '/user/login',
      query: { redirect: currentPath }
    })
  } else {
    message.error(errorMessage)
  }

  return false
}

/**
 * 创建带错误处理的异步函数包装器
 * @param fn 异步函数
 * @param options 错误处理选项
 * @returns 包装后的函数
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorHandlerOptions = {}
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleApiError(error, options)
      throw error
    }
  }) as T
}

