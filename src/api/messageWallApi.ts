/**
 * 留言墙API模块
 * 提供统一的留言墙相关API调用接口
 */

import * as messageWallController from './messageWallController'
import { handleApiError, handleBusinessError } from '@/utils/errorHandler'
import { apiLogger } from '@/utils/logger'
import { API_CONSTANTS } from '@/constants'
import type {
  MessageWallQueryRequest,
  AddMessageRequest,
  ScenicMessageWall,
  MessageWallMessage,
  PageResponse,
  BaseResponse,
  MessageWallStatus
} from '@/types/messageWall'

/**
 * 审核留言参数
 */
export interface ReviewMessageParams {
  /** 留言ID */
  messageId: number
  /** 审核状态: 1-通过 2-拒绝 */
  status: MessageWallStatus
}

/**
 * 留言墙API类
 */
class MessageWallAPI {
  /**
   * 获取留言列表
   * @param params 查询参数
   * @returns 留言列表响应
   */
  async listMessages(params: MessageWallQueryRequest) {
    try {
      apiLogger.debug('获取留言列表', params)
      
      const response = await messageWallController.listMessages(
        params as API.MessageWallQueryRequest
      )
      
      apiLogger.info('留言列表获取成功', {
        total: response.data?.data?.total,
        current: params.current
      })
      
      return response
    } catch (error) {
      apiLogger.error('获取留言列表失败', error)
      throw error
    }
  }

  /**
   * 添加留言
   * @param params 留言参数
   * @returns 添加结果
   */
  async addMessage(params: AddMessageRequest) {
    try {
      apiLogger.debug('添加留言', { scenicSpotId: params.scenicSpotId })
      
      const response = await messageWallController.addMessage(
        params as API.MessageWallDTO
      )
      
      if (handleBusinessError(response.data, '发送留言失败')) {
        apiLogger.info('留言添加成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('添加留言失败', error)
      throw error
    }
  }

  /**
   * 删除留言
   * @param messageId 留言ID
   * @returns 删除结果
   */
  async deleteMessage(messageId: number) {
    try {
      apiLogger.debug('删除留言', { messageId })
      
      const response = await messageWallController.deleteMessage({
        messageId
      })
      
      if (handleBusinessError(response.data, '删除留言失败')) {
        apiLogger.info('留言删除成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('删除留言失败', error)
      throw error
    }
  }

  /**
   * 审核留言
   * @param params 审核参数
   * @returns 审核结果
   */
  async reviewMessage(params: ReviewMessageParams) {
    try {
      apiLogger.debug('审核留言', params)
      
      const response = await messageWallController.reviewMessage({
        messageId: params.messageId,
        status: params.status
      })
      
      if (handleBusinessError(response.data, '审核留言失败')) {
        apiLogger.info('留言审核成功', params)
      }
      
      return response
    } catch (error) {
      apiLogger.error('审核留言失败', error)
      throw error
    }
  }

  /**
   * 点赞留言
   * @param messageId 留言ID
   * @returns 点赞结果
   */
  async likeMessage(messageId: number) {
    try {
      apiLogger.debug('点赞留言', { messageId })
      
      const response = await messageWallController.likeMessage({
        messageId
      })
      
      if (handleBusinessError(response.data, '点赞失败')) {
        apiLogger.info('点赞成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('点赞留言失败', error)
      throw error
    }
  }

  /**
   * 取消点赞
   * @param messageId 留言ID
   * @returns 取消点赞结果
   */
  async cancelLikeMessage(messageId: number) {
    try {
      apiLogger.debug('取消点赞', { messageId })
      
      const response = await messageWallController.cancelLikeMessage({
        messageId
      })
      
      if (handleBusinessError(response.data, '取消点赞失败')) {
        apiLogger.info('取消点赞成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('取消点赞失败', error)
      throw error
    }
  }

  /**
   * 获取所有景点留言墙
   * @returns 景点留言墙列表
   */
  async getAllScenicMessageWalls() {
    try {
      apiLogger.debug('获取所有景点留言墙')
      
      const response = await messageWallController.getAllScenicMessageWalls()
      
      apiLogger.info('景点留言墙列表获取成功', {
        count: response.data?.data?.length
      })
      
      return response
    } catch (error) {
      apiLogger.error('获取景点留言墙列表失败', error)
      throw error
    }
  }

  /**
   * 创建景点留言墙
   * @param params 创建参数
   * @returns 创建结果
   */
  async createScenicMessageWall(params: Partial<ScenicMessageWall>) {
    try {
      apiLogger.debug('创建景点留言墙', params)
      
      const response = await messageWallController.createScenicMessageWall(
        params as API.ScenicMessageWallDTO
      )
      
      if (handleBusinessError(response.data, '创建留言墙失败')) {
        apiLogger.info('留言墙创建成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('创建景点留言墙失败', error)
      throw error
    }
  }

  /**
   * 更新景点留言墙
   * @param params 更新参数
   * @returns 更新结果
   */
  async updateScenicMessageWall(params: Partial<ScenicMessageWall>) {
    try {
      apiLogger.debug('更新景点留言墙', params)
      
      const response = await messageWallController.updateScenicMessageWall(
        params as API.ScenicMessageWallDTO
      )
      
      if (handleBusinessError(response.data, '更新留言墙失败')) {
        apiLogger.info('留言墙更新成功')
      }
      
      return response
    } catch (error) {
      apiLogger.error('更新景点留言墙失败', error)
      throw error
    }
  }
}

// 导出单例
export const messageWallApi = new MessageWallAPI()

// 导出默认实例
export default messageWallApi

// 重新导出类型供外部使用
export type {
  MessageWallQueryRequest,
  AddMessageRequest,
  ScenicMessageWall,
  MessageWallMessage,
  PageResponse,
  BaseResponse,
  MessageWallStatus,
  ReviewMessageParams
} from '@/types/messageWall'

