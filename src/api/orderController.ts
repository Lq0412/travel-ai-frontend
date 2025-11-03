// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /orders/${param0}/items */
export async function listOrderItems(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderItemsParams,
  options?: { [key: string]: any }
) {
  const { orderId: param0, ...queryParams } = params
  return request<API.BaseResponseListOrderItem>(`/orders/${param0}/items`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /orders/create */
export async function createOrder(body: API.CreateOrderRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /orders/my */
export async function listMyOrders(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMyOrdersParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageOrder>('/orders/my', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // size has a default value: 10
      size: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /orders/my/${param0} */
export async function getMyOrderDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMyOrderDetailParams,
  options?: { [key: string]: any }
) {
  const { orderId: param0, ...queryParams } = params
  return request<API.BaseResponseOrder>(`/orders/my/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 支付订单 POST /orders/pay */
export async function payOrder(
  params: { orderId: number; payMethod: number },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/orders/pay', {
    method: 'POST',
    params,
    ...(options || {}),
  })
}

/** 取消订单 POST /orders/cancel */
export async function cancelOrder(
  params: { orderId: number; reason?: string },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/orders/cancel', {
    method: 'POST',
    params,
    ...(options || {}),
  })
}

/** 商家端订单列表 GET /orders/merchant/list */
export async function merchantListOrders(
  params?: { current?: number; size?: number },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseIPageOrder>('/orders/merchant/list', {
    method: 'GET',
    params: {
      current: '1',
      size: '10',
      ...params,
    },
    ...(options || {}),
  })
}

/** 商家端订单详情 GET /orders/merchant/{orderId} */
export async function merchantGetOrderDetail(
  params: { orderId: number },
  options?: { [key: string]: any }
) {
  const { orderId } = params
  return request<API.BaseResponseOrder>(`/orders/merchant/${orderId}`, {
    method: 'GET',
    ...(options || {}),
  })
}

/** 商家发货 POST /orders/merchant/{orderId}/ship */
export async function merchantShipOrder(
  params: { orderId: number; trackingNumber?: string },
  options?: { [key: string]: any }
) {
  const { orderId, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/orders/merchant/${orderId}/ship`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 商家取消订单 POST /orders/merchant/{orderId}/cancel */
export async function merchantCancelOrder(
  params: { orderId: number; reason?: string },
  options?: { [key: string]: any }
) {
  const { orderId, ...queryParams } = params
  return request<API.BaseResponseBoolean>(`/orders/merchant/${orderId}/cancel`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
