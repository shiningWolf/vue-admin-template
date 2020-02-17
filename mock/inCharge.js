import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    branch: '@sentence(4, 6)',
    description: '@sentence(8, 9)',
    author: '@sentence(1, 2)',
    timestamp: '@datetime(yyyy-MM-dd)',
    branchType: '@sentence(1, 2)',
    status: '1',
    unSyncBranch: '@sentence(4, 6)'
  }]
})

export default [
  {
    url: '/vue-admin-template/incharge/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/incharge/create',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          ok: true
        }
      }
    }
  },
  {
    url: '/vue-admin-template/incharge/update',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          ok: true
        }
      }
    }
  }
]

