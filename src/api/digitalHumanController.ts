// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /digital-human/chat */
export async function chat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chatParams,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>('/digital-human/chat', {
    method: 'POST',
    params: {
      // voiceSpeed has a default value: 1
      voiceSpeed: '1',
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /digital-human/chat-simple */
export async function chatSimple(body: Record<string, any>, options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringObject>('/digital-human/chat-simple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /digital-human/test */
export async function test(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringObject>('/digital-human/test', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /digital-human/voices */
export async function getVoices(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringObject>('/digital-human/voices', {
    method: 'GET',
    ...(options || {}),
  })
}
