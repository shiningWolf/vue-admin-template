// Just a mock data
const Layout = 'layout/Layout'
export const constantRoutes = [
    {
      path: '/redirect',
      component: 'layout/Layout',
      hidden: true,
      children: [
        {
          path: '/redirect/:path*',
          component: 'views/redirect/index'
        }
      ]
    },
    {
      path: '/login',
      component: 'views/login/index',
      hidden: true
    },
    {
      path: '/auth-redirect',
      component: 'views/login/auth-redirect',
      hidden: true
    },
    {
      path: '/404',
      component: 'views/error-page/404',
      hidden: true
    },
    {
      path: '/401',
      component: 'views/error-page/401',
      hidden: true
    },
    {
      path: '',
      component: 'layout/Layout',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          component: 'views/dashboard/index',
          name: 'Dashboard',
          meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
        }
      ]
    }
  ]
  
  export const asyncRoutes = [
    {
        path: '/demand',
        component: Layout,
        children: [
          {
            path: 'index',
            name: '需求',
            component: () => import('@/views/demand/index'),
            meta: { title: '需求', icon: 'form' }
          }
        ]
      },
      {
        path: '/permission',
        component: Layout,
        alwaysShow: true, // will always show the root menu
        name: 'Permission',
        meta: {
          title: 'Permission',
          icon: 'lock',
          roles: ['admin', 'editor'] // you can set roles in root nav
        },
        children: [
          {
            path: 'role',
            component: () => import('@/views/permission/index'),
            name: 'RolePermission',
            meta: {
              title: 'Role Permission',
              roles: ['admin']
            }
          }
        ]
      },
      {
        path: '/problemsync',
        component: Layout,
        redirect: '/problemsync/index',
        meta: { title: '问题同步', icon: 'example' },
        children: [
          {
            path: 'index',
            name: 'problemsync',
            component: () => import('@/views/branchmanager'),
            meta: { title: '分支类型管理', icon: 'form' }
          },
          {
            path: 'problem-list',
            name: 'problem-list',
            component: () => import('@/views/problemlist'),
            meta: { title: '问题列表', icon: 'form' }
          },
          {
            path: 'branchsync',
            name: 'branchsync',
            component: () => import('@/views/branchsync'),
            meta: { title: '未同步分支列表', icon: 'form' }
          }
        ]
      }
  ]