import request from '@/utils/request'

export function getBranchList(params) {
  return request({
    url: '/vue-admin-template/branchmanage/list',
    method: 'get',
    params
  })
}
export function createBranch(data) {
  return request({
    url: '/vue-admin-template/branchmanage/create',
    method: 'post',
    data
  })
}
export function deleteBranch(data) {
  return request({
    url: '/vue-admin-template/branchmanage/delete',
    method: 'post',
    data
  })
}
export function updateBranch(data) {
  return request({
    url: '/vue-admin-template/branchmanage/update',
    method: 'post',
    data
  })
}
