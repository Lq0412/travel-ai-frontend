// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /ai/chat */
export async function chat1(body: API.AIRequest, options?: { [key: string]: any }) {
  return request<API.ResponseDTOAIResponse>('/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai/digital-human/stream */
export async function digitalHumanStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.digitalHumanStreamParams,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>('/ai/digital-human/stream', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /ai/tourism/stream */
export async function tourismStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.tourismStreamParams,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>('/ai/tourism/stream', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
