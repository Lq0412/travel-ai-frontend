// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /ai/conversations */
export async function getUserConversations(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserConversationsParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseDTOListAIConversationVO>('/ai/conversations', {
    method: 'GET',
    params: {
      // pageNum has a default value: 1
      pageNum: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /ai/conversations */
export async function createConversation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.createConversationParams,
  options?: { [key: string]: any }
) {
  return request<API.ResponseDTOAIConversation>('/ai/conversations', {
    method: 'POST',
    params: {
      // provider has a default value: dashscope
      provider: 'dashscope',
      // model has a default value: qwen-plus
      model: 'qwen-plus',
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai/conversations/${param0} */
export async function getConversation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConversationParams,
  options?: { [key: string]: any }
) {
  const { conversationId: param0, ...queryParams } = params
  return request<API.ResponseDTOAIConversation>(`/ai/conversations/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 DELETE /ai/conversations/${param0} */
export async function deleteConversation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteConversationParams,
  options?: { [key: string]: any }
) {
  const { conversationId: param0, ...queryParams } = params
  return request<API.ResponseDTOBoolean>(`/ai/conversations/${param0}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai/conversations/${param0}/messages */
export async function getConversationMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getConversationMessagesParams,
  options?: { [key: string]: any }
) {
  const { conversationId: param0, ...queryParams } = params
  return request<API.ResponseDTOListAIMessage>(`/ai/conversations/${param0}/messages`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai/conversations/${param0}/messages/recent */
export async function getRecentMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecentMessagesParams,
  options?: { [key: string]: any }
) {
  const { conversationId: param0, ...queryParams } = params
  return request<API.ResponseDTOListAIMessage>(`/ai/conversations/${param0}/messages/recent`, {
    method: 'GET',
    params: {
      // limit has a default value: 10
      limit: '10',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 PUT /ai/conversations/${param0}/title */
export async function updateConversationTitle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateConversationTitleParams,
  options?: { [key: string]: any }
) {
  const { conversationId: param0, ...queryParams } = params
  return request<API.ResponseDTOBoolean>(`/ai/conversations/${param0}/title`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
