import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    content: '@sentence(10, 20)',
    'status|1': ['resolved', 'pending', 'rejected'],
    author: 'author',
    excuter:'excuter',
    timestamp: '@datetime(yyyy-MM-dd)',
    pageviews: '@integer(300, 5000)'
  }]
})
const detail = Mock.mock({
    'items|3': [{
      'id|+1': 1,
      content: '@sentence(10, 20)',
      'status|1': ['resolved', 'pending', 'rejected'],
      author: 'author',
      excuter:'excuter',
      timestamp: '@datetime(yyyy-MM-dd)',
    }]
  })
export default [
    {
      url: '/vue-admin-template/demand/list',
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
        url: '/vue-admin-template/demand/create',
        type: 'post',
        response: config => {
          const items = data.items
          return {
            code: 20000,
            data: {
                ok:true
            }
          }
        }
      },
      {
        url: '/vue-admin-template/demand/update',
        type: 'post',
        response: config => {
          const items = data.items
          return {
            code: 20000,
            data: {
              ok:true
            }
          }
        }
      },
      {
        url: '/vue-admin-template/demand/history',
        type: 'get',
        response: config => {
          const items = detail.items
          return {
            code: 20000,
            data: {
                items: items
            }
          }
        }
      }
  ]

  