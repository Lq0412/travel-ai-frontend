/**
 * 生成聊天室ID
 * @returns {number} 适合int范围的聊天室ID
 */
export function generateMemoryId() {
  // 使用当前时间戳的后9位，确保在int范围内
  return Math.floor(Date.now() % 1000000000)
}

// 注意：formatTime函数已移至 @/util/timeUtils.ts 统一管理

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
