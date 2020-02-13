import Mock from 'mockjs'

const data = Mock.mock({
  'items|15': [{
    'id|+1': 1,
    branch: '@sentence(4, 6)',
    branchManager: '@sentence(1, 2)',
    branchType: '@sentence(1, 2)',
    timestamp: '@datetime(yyyy-MM-dd)'
  }]
})

export default [
  {
    url: '/vue-admin-template/branchmanage/list',
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
    url: '/vue-admin-template/branchmanage/create',
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
    url: '/vue-admin-template/branchsync/update',
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

