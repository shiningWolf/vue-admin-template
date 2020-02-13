import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    'id|+1': 1,
    name: '@sentence(2, 4)',
    current:'@sentence(2, 8)',
    'type|1': ['分支类型1', '分支类型2', '分支类型3','分支类型4','分支类型5','分支类型6'],
    'status|1': ['resolved', 'pending'],
    author: 'author',
    timestamp: '@datetime(yyyy-MM-dd)',
    pageviews: '@integer(300, 5000)'
  }]
})
export default [
    {
      url: '/vue-admin-template/problem/list',
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
    }
  ]

  