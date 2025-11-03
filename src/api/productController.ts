// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 获取商品详情 GET /product/get/${param0} */
export async function getProductById(
  params: API.getProductByIdParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseProduct>(`/product/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 分页获取商品列表（用户端） GET /product/list */
export async function listProducts(
  params?: API.listProductsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageProduct>('/product/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** POST /product/admin/add */
export async function adminAddProduct(
  body: API.Product,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/product/admin/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** POST /product/admin/delete */
export async function adminDeleteProduct(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/product/admin/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** GET /product/admin/get/${param0} */
export async function adminGetProduct(
  params: API.adminGetProductParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseProduct>(`/product/admin/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** POST /product/admin/list/page */
export async function adminListProducts(
  body?: any,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageProduct>('/product/admin/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** POST /product/admin/update */
export async function adminUpdateProduct(
  body: API.Product,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/product/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

  /** 商家端添加商品 POST /product/merchant/add */
export async function merchantAddProduct(
  body: API.Product,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/product/merchant/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 商家端更新商品 POST /product/merchant/update */
export async function merchantUpdateProduct(
  body: API.Product,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/product/merchant/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 商家端删除商品 POST /product/merchant/delete */
export async function merchantDeleteProduct(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/product/merchant/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 商家端商品列表 GET /product/merchant/list */
export async function merchantListProducts(
  params?: { current?: number; pageSize?: number },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageProduct>('/product/merchant/list', {
    method: 'GET',
    params: {
      current: '1',
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}
