/**
 * Created by HuXiaKe on 19/05/18.
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      // component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/stock',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'stock',
        component: () => import('@/views/stock/index'),
        meta: { title: '库存管理', icon: 'kucun' }
      },
      {
        path: 'details/:id',
        name: 'stockDetails',
        hidden: true,
        component: () => import('@/views/stock/stockDetails'),
        meta: { title: '库存详情', icon: 'kucun' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'dingdan' }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '拿货管理', icon: 'nahuo' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/get_goods/index'),
        meta: { title: '拿货列表', icon: 'liebiao' }
      },
      {
        path: 'feedback',
        name: 'feedback',
        // component: () => import('@/views/tree/index'),
        meta: { title: '拿货反馈', icon: 'fankui' }
      }
    ]
  },

  {
    path: '/downpage',
    name: 'downpage',
    hidden: true,
    component: () => import('@/views/components/downpage'),
    meta: { title: 'downPage', icon: 'fankui' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
