// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /interaction/favorite/post */
export async function favoritePost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/interaction/favorite/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /interaction/favorite/post/check */
export async function checkPostFavorite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkPostFavoriteParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/interaction/favorite/post/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/like/comment */
export async function likeComment(body: API.CommentLikeRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/interaction/like/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /interaction/like/comment/check */
export async function checkCommentLike(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkCommentLikeParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/interaction/like/comment/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/like/post */
export async function likePost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/interaction/like/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /interaction/like/post/check */
export async function checkPostLike(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkPostLikeParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/interaction/like/post/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/posts/latest */
export async function getLatestPosts(body: API.PostQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePagePost>('/interaction/posts/latest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/posts/most-commented */
export async function getMostCommentedPosts(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePost>('/interaction/posts/most-commented', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/posts/most-liked */
export async function getMostLikedPosts(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePost>('/interaction/posts/most-liked', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/posts/most-viewed */
export async function getMostViewedPosts(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePost>('/interaction/posts/most-viewed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/unfavorite/post */
export async function unfavoritePost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/interaction/unfavorite/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/unlike/comment */
export async function unlikeComment(
  body: API.CommentLikeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/interaction/unlike/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /interaction/unlike/post */
export async function unlikePost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/interaction/unlike/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
