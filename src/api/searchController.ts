// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /search/posts */
export async function searchPosts(body: API.PostQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePagePostVO>('/search/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /search/posts/by-tag */
export async function searchPostsByTag(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/search/posts/by-tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /search/posts/by-tag-id */
export async function searchPostsByTagId(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/search/posts/by-tag-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /search/posts/by-tag-ids */
export async function searchPostsByTagIds(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/search/posts/by-tag-ids', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /search/posts/by-tag-names */
export async function searchPostsByTagNames(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePostVO>('/search/posts/by-tag-names', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /search/tags */
export async function searchTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchTagsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTag>('/search/tags', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /search/tags/by-post/${param0} */
export async function getTagsByPostId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTagsByPostIdParams,
  options?: { [key: string]: any }
) {
  const { postId: param0, ...queryParams } = params
  return request<API.BaseResponseListTag>(`/search/tags/by-post/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /search/tags/hot */
export async function getHotTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHotTagsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTag>('/search/tags/hot', {
    method: 'GET',
    params: {
      // limit has a default value: 10
      limit: '10',
      ...params,
    },
    ...(options || {}),
  })
}
