// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /merchant/${param0}/products */
export async function getMerchantProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantProductsParams,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params
  return request<API.BaseResponseIPageProduct>(`/merchant/${param0}/products`, {
    method: 'GET',
    params: {
      ...queryParams,
      queryRequest: undefined,
      ...queryParams['queryRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/admin/add */
export async function adminAddMerchant(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/merchant/admin/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/admin/delete */
export async function adminDeleteMerchant(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/merchant/admin/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /merchant/admin/get/${param0} */
export async function adminGetMerchant(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminGetMerchantParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseMerchant>(`/merchant/admin/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/admin/list/page */
export async function adminListMerchants(
  body: API.MerchantQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageMerchant>('/merchant/admin/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/admin/update */
export async function adminUpdateMerchant(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/merchant/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /merchant/detail/${param0} */
export async function getMerchantDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantDetailParams,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params
  return request<API.BaseResponseMerchant>(`/merchant/detail/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /merchant/list */
export async function getMerchantList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantListParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageMerchant>('/merchant/list', {
    method: 'GET',
    params: {
      ...params,
      queryRequest: undefined,
      ...params['queryRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /merchant/recommended */
export async function getRecommendedMerchants(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecommendedMerchantsParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListMerchant>('/merchant/recommended', {
    method: 'GET',
    params: {
      // limit has a default value: 10
      limit: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/search */
export async function searchMerchants(
  body: API.MerchantQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageMerchant>('/merchant/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取当前商家的商家信息 GET /merchant/get/my */
export async function getMyMerchant(options?: { [key: string]: any }) {
  return request<API.BaseResponseMerchant>('/merchant/get/my', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新当前商家的商家信息 POST /merchant/update/my */
export async function updateMyMerchant(
  body: API.Merchant,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/merchant/update/my', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
