// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /category/add */
export async function addCategory(body: API.Category, options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /category/delete/${param0} */
export async function deleteCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCategoryParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/category/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /category/get/${param0} */
export async function getCategoryById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseCategory>(`/category/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /category/list */
export async function listAllCategories(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCategory>('/category/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /category/update */
export async function updateCategory(body: API.Category, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
