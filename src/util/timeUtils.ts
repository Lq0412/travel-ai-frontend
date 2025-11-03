/**
 * 时间格式化工具类
 * 统一处理所有时间格式化需求
 */

/**
 * 格式化时间为标准格式 (YYYY-MM-DD HH:mm:ss)
 * @param timeStr 时间字符串或时间戳
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeStr?: string | number | Date): string {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间为日期格式 (YYYY-MM-DD)
 * @param timeStr 时间字符串或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(timeStr?: string | number | Date): string {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 格式化时间为相对时间 (如：2小时前、3天前)
 * @param timeStr 时间字符串或时间戳
 * @returns 相对时间字符串
 */
export function formatRelativeTime(timeStr?: string | number | Date): string {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years}年前`
  if (months > 0) return `${months}个月前`
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

/**
 * 格式化时间为聊天时间格式 (HH:mm)
 * @param timeStr 时间字符串或时间戳
 * @returns 聊天时间字符串
 */
export function formatChatTime(timeStr?: string | number | Date): string {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  if (isNaN(date.getTime())) return ''

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

/**
 * 检查时间是否为今天
 * @param timeStr 时间字符串或时间戳
 * @returns 是否为今天
 */
export function isToday(timeStr?: string | number | Date): boolean {
  if (!timeStr) return false

  const date = new Date(timeStr)
  const today = new Date()

  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

/**
 * 检查时间是否为昨天
 * @param timeStr 时间字符串或时间戳
 * @returns 是否为昨天
 */
export function isYesterday(timeStr?: string | number | Date): boolean {
  if (!timeStr) return false

  const date = new Date(timeStr)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear()
}
