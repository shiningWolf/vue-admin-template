import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/problem/list',
    method: 'get',
    params
  })
}
export function updateProblem(data) {
  return request({
    url: '/vue-admin-template/problem/update',
    method: 'post',
    data
  })
}
export function deleteProblem(data) {
  return request({
    url: '/vue-admin-template/problem/delete',
    method: 'post',
    data
  })
}
export function createProblem(data) {
  return request({
    url: '/vue-admin-template/problem/create',
    method: 'post',
    data
  })
}