// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /message/wall/add */
export async function addMessage(body: API.MessageWallDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseMessageWallVO>('/message/wall/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/cancelLike/${param0} */
export async function cancelLikeMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelLikeMessageParams,
  options?: { [key: string]: any }
) {
  const { messageId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/message/wall/cancelLike/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/delete/${param0} */
export async function deleteMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMessageParams,
  options?: { [key: string]: any }
) {
  const { messageId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/message/wall/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/like/${param0} */
export async function likeMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.likeMessageParams,
  options?: { [key: string]: any }
) {
  const { messageId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/message/wall/like/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/list */
export async function listMessages(
  body: API.MessageWallQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMessageWallVO>('/message/wall/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /message/wall/list/all */
export async function getAllScenicMessageWalls(options?: { [key: string]: any }) {
  return request<API.BaseResponseListScenicMessageWallVO>('/message/wall/list/all', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/review/${param0} */
export async function reviewMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reviewMessageParams,
  options?: { [key: string]: any }
) {
  const { messageId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/message/wall/review/${param0}`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /message/wall/scenic/create */
export async function createScenicMessageWall(
  body: API.ScenicMessageWallDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScenicMessageWallVO>('/message/wall/scenic/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 PUT /message/wall/scenic/update */
export async function updateScenicMessageWall(
  body: API.ScenicMessageWallDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseScenicMessageWallVO>('/message/wall/scenic/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
