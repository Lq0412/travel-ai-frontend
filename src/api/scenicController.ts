// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /scenic/${param0} */
export async function getScenicDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getScenicDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseScenicSpot>(`/scenic/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /scenic/list */
export async function listSpots(options?: { [key: string]: any }) {
  return request<API.BaseResponseListScenicSpot>('/scenic/list', {
    method: 'GET',
    ...(options || {}),
  })
}
