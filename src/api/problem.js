import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/problem/list',
    method: 'get',
    params
  })
}
export function updateDemand(params) {
  return request({
    url: '/vue-admin-template/problem/update',
    method: 'post',
    params
  })
}