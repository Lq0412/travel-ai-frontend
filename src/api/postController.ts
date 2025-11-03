// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /post/${param0}/tags */
export async function updatePostTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePostTagsParams,
  body: string[],
  options?: { [key: string]: any }
) {
  const { postId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/post/${param0}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post/add */
export async function addPost(body: API.PostAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /post/get/${param0} */
export async function getPostById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponsePostVO>(`/post/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post/list/byCategory */
export async function listPostByCategory(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePost>('/post/list/byCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /post/list/page */
export async function listPostByPage(body: API.PostQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePagePost>('/post/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /post/tags/all */
export async function getAllTags(options?: { [key: string]: any }) {
  return request<API.BaseResponseListTag>('/post/tags/all', {
    method: 'GET',
    ...(options || {}),
  })
}
