import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/demand/list',
    method: 'get',
    params
  })
}
  export function createDemand(params) {
    return request({
      url: '/vue-admin-template/demand/create',
      method: 'post',
      params
    })
  }
  export function updateDemand(params) {
    return request({
      url: '/vue-admin-template/demand/update',
      method: 'post',
      params
    })
  }
  export function demandHistory(params) {
    return request({
        url: '/vue-admin-template/demand/history',
        method: 'get',
        params
      })
  }