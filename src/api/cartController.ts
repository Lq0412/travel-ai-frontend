// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** POST /cart/add */
export async function addToCart(
  body: API.Cart,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** GET /cart/list */
export async function getCartList(
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListCartVO>('/cart/list', {
    method: 'GET',
    params: {},
    ...(options || {}),
  })
}

/** POST /cart/update */
export async function updateCart(
  body: API.Cart,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/cart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** POST /cart/delete */
export async function deleteCart(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/cart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** POST /cart/clear */
export async function clearCart(
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/cart/clear', {
    method: 'POST',
    params: {},
    ...(options || {}),
  })
}

