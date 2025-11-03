// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /comment/add */
export async function addComment(body: API.CommentAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /comment/delete */
export async function deleteComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCommentParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/comment/delete', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /comment/list/page */
export async function listCommentByPage(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageComment>('/comment/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /comment/reply/add */
export async function addReply(body: API.CommentAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/comment/reply/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /comment/reply/list/page */
export async function listRepliesByPage(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageComment>('/comment/reply/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /comment/update */
export async function updateComment(body: API.Comment, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/comment/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
