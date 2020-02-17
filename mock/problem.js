import Mock from 'mockjs'
let branchListPool = (() => {
  let pool = []
  for(let i = 0 ; i <30 ; i++) {
    pool.push('分支' + i)
  }
  return pool
} )()
console.log(branchListPool)
const data = Mock.mock({
  'items|30': [{
    '_id|+1': 1,
    name: '@sentence(2, 4)',
    'branchId|+1':branchListPool,
    branchList:branchListPool,
    userId:'@sentence(2, 4)',
    timestamp: '@datetime(yyyy-MM-dd)',
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
    },
    {
      url: '/vue-admin-template/problem/update',
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
  ]

  