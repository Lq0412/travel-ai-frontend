// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /debug/routes */
export async function getAllRoutes(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/debug/routes', {
    method: 'GET',
    ...(options || {}),
  })
}
