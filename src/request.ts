import axios from 'axios'
import { apiLogger } from '@/utils/logger'

const instance = axios.create({
  baseURL: '/api',
  timeout: 60000,
  withCredentials: true,
  transformResponse: [
    function (data) {
      // 在JSON解析之前处理大整数
      if (typeof data === 'string') {
        try {
          // 使用正则表达式将大整数ID转换为字符串
          const processedData = data.replace(/"id":(\d{16,})/g, '"id":"$1"');
          return JSON.parse(processedData);
        } catch (error) {
          apiLogger.warn('处理大整数时出错', error);
          return JSON.parse(data);
        }
      }
      return data;
    }
  ]
});

// 添加请求拦截器到 instance 上
instance.interceptors.request.use(function (config) {
  // 确保 Content-Type 正确设置（如果请求数据是对象且没有设置 Content-Type）
  if (config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
    // 检查是否已设置 Content-Type
    const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type']
    if (!contentType && config.headers) {
      config.headers['Content-Type'] = 'application/json'
    }
  }
  
  // 记录请求信息
  apiLogger.debug('发送请求', {
    method: config.method?.toUpperCase(),
    url: config.url,
    withCredentials: config.withCredentials,
    contentType: config.headers?.['Content-Type'] || config.headers?.['content-type'] || '未设置'
  })
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  apiLogger.error('请求拦截器错误', error)
  return Promise.reject(error);
});

// 添加响应拦截器到 instance 上
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  apiLogger.debug('响应成功', {
    method: response.config.method?.toUpperCase(),
    url: response.config.url,
    status: response.status,
    code: response.data?.code
  })
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  apiLogger.error('响应错误', {
    method: error.config?.method?.toUpperCase(),
    url: error.config?.url,
    status: error.response?.status,
    message: error.response?.data?.message
  })
  return Promise.reject(error);
});

export default instance;
