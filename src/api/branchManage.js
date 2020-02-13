import request from '@/utils/request'

export function getBranchList(params) {
  return request({
    url: '/vue-admin-template/branchmanage/list',
    method: 'get',
    params
  })
}
export function createBranch(params) {
  return request({
    url: '/vue-admin-template/branchmanage/create',
    method: 'post',
    params
  })
}
export function updateBranch(params) {
  return request({
    url: '/vue-admin-template/branchmanage/update',
    method: 'post',
    params
  })
}
