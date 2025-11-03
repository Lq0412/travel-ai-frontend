/**
 * 留言墙相关类型定义
 */

/**
 * 留言墙状态枚举
 */
export enum MessageWallStatus {
  /** 待审核 */
  PENDING = 0,
  /** 已通过 */
  APPROVED = 1,
  /** 已拒绝 */
  REJECTED = 2
}

/**
 * 留言墙消息
 */
export interface MessageWallMessage {
  /** 留言ID */
  id: number
  /** 景点ID */
  scenicSpotId: number
  /** 用户ID */
  userId?: number
  /** 用户名 */
  userName?: string
  /** 用户头像 */
  userAvatar?: string
  /** 留言内容 */
  content: string
  /** 是否为弹幕模式 */
  isBarrage?: boolean
  /** 文字颜色 */
  textColor?: string
  /** 字体大小 */
  fontSize?: number
  /** 弹幕速度(0-100) */
  barrageSpeed?: number
  /** 状态: 0-待审核 1-已通过 2-已拒绝 */
  status: MessageWallStatus
  /** 点赞数 */
  likeCount?: number
  /** 当前用户是否已点赞 */
  isLiked?: boolean
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 留言墙查询请求
 */
export interface MessageWallQueryRequest {
  /** 景点ID */
  scenicSpotId?: number
  /** 是否弹幕模式 */
  isBarrage?: boolean
  /** 留言状态 */
  status?: MessageWallStatus
  /** 关键词搜索 */
  keyword?: string
  /** 当前页码 */
  current?: number
  /** 每页大小 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序顺序: ascend | descend */
  sortOrder?: 'ascend' | 'descend'
}

/**
 * 添加留言请求
 */
export interface AddMessageRequest {
  /** 景点ID */
  scenicSpotId: number
  /** 留言内容 */
  content: string
  /** 是否为弹幕 */
  isBarrage?: boolean
  /** 文字颜色 */
  textColor?: string
  /** 字体大小 */
  fontSize?: number
  /** 弹幕速度 */
  barrageSpeed?: number
}

/**
 * 景点留言墙配置
 */
export interface ScenicMessageWall {
  /** ID */
  id?: number
  /** 景点ID */
  scenicSpotId: number
  /** 景点名称 */
  scenicSpotName?: string
  /** 留言墙标题 */
  title: string
  /** 留言墙描述 */
  description?: string
  /** 留言数量 */
  messageCount?: number
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  /** 数据列表 */
  records: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  current: number
  /** 每页大小 */
  pageSize: number
  /** 总页数 */
  pages?: number
}

/**
 * 基础API响应
 */
export interface BaseResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应数据 */
  data?: T
  /** 响应消息 */
  message?: string
}

/**
 * 景点信息
 */
export interface ScenicSpot {
  /** 景点ID */
  id: number
  /** 景点名称 */
  name: string
  /** 景点简介 */
  introduction?: string
  /** 位置 */
  location?: string
  /** 封面图URL */
  coverUrl?: string
  /** 详细描述 */
  description?: string
  /** 评分 */
  rating?: number
  /** 标签 */
  tags?: string[]
  /** 开放时间 */
  openTime?: string
  /** 门票价格 */
  ticketPrice?: number
  /** 创建时间 */
  createTime?: string
}

/**
 * 留言墙统计信息
 */
export interface MessageWallStats {
  /** 总留言数 */
  totalMessages: number
  /** 待审核数 */
  pendingMessages: number
  /** 已通过数 */
  approvedMessages: number
  /** 已拒绝数 */
  rejectedMessages: number
  /** 今日新增 */
  todayNewMessages: number
}

/**
 * 弹幕样式配置
 */
export interface BarrageStyleConfig {
  /** 行高 */
  rowHeight: number
  /** 字体大小 */
  fontSize: number
  /** 文字颜色 */
  color: string
  /** 动画时长(秒) */
  duration: number
  /** 延迟时间(秒) */
  delay: number
  /** top位置 */
  top: number
}

/**
 * 留言墙组件Props
 */
export interface MessageWallProps {
  /** 景点ID */
  scenicSpotId?: number
  /** 是否显示输入框 */
  showInput?: boolean
  /** 是否自动刷新 */
  autoRefresh?: boolean
  /** 刷新间隔(毫秒) */
  refreshInterval?: number
  /** 最大显示数量 */
  maxMessages?: number
}

/**
 * 留言墙事件
 */
export interface MessageWallEvents {
  /** 发送留言 */
  onSend: (content: string) => void
  /** 点赞留言 */
  onLike: (messageId: number) => void
  /** 取消点赞 */
  onUnlike: (messageId: number) => void
  /** 删除留言 */
  onDelete: (messageId: number) => void
  /** 留言加载完成 */
  onLoaded: (messages: MessageWallMessage[]) => void
  /** 错误处理 */
  onError: (error: Error) => void
}

/**
 * 留言墙Composable返回值
 */
export interface UseMessageWallReturn {
  /** 留言列表 */
  messages: MessageWallMessage[]
  /** 加载状态 */
  loading: boolean
  /** 发送状态 */
  sending: boolean
  /** 加载留言 */
  loadMessages: () => Promise<void>
  /** 发送留言 */
  sendMessage: (content: string) => Promise<void>
  /** 点赞留言 */
  likeMessage: (messageId: number) => Promise<void>
  /** 取消点赞 */
  unlikeMessage: (messageId: number) => Promise<void>
  /** 删除留言 */
  deleteMessage: (messageId: number) => Promise<void>
  /** 刷新留言 */
  refreshMessages: () => Promise<void>
}

/**
 * 类型守卫：检查是否为有效的留言状态
 */
export function isValidMessageStatus(status: any): status is MessageWallStatus {
  return (
    status === MessageWallStatus.PENDING ||
    status === MessageWallStatus.APPROVED ||
    status === MessageWallStatus.REJECTED
  )
}

/**
 * 类型守卫：检查是否为有效的留言消息
 */
export function isMessageWallMessage(obj: any): obj is MessageWallMessage {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.scenicSpotId === 'number' &&
    typeof obj.content === 'string' &&
    isValidMessageStatus(obj.status)
  )
}

/**
 * 类型守卫：检查是否为分页响应
 */
export function isPageResponse<T>(obj: any): obj is PageResponse<T> {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.records) &&
    typeof obj.total === 'number' &&
    typeof obj.current === 'number' &&
    typeof obj.pageSize === 'number'
  )
}

