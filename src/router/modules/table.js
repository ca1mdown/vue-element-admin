/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: 'Complex Table' }
    },
    {
      path: 'store-info-table',
      component: () => import('@/views/table/business-table/store-info-table'),
      name: 'StoreTable',
      meta: { title: 'Store Table' }
    },
    {
      path: 'store-goods-table/:storeFlag',
      component: () => import('@/views/table/business-table/store-goods-table'),
      name: 'GoodsTable',
      meta: { title: 'Goods Table' }
    },
    {
      path: 'store-activity-table/:storeFlag',
      component: () => import('@/views/table/business-table/store-activity-table'),
      name: 'ActivityTable',
      meta: { title: 'Activity Table' }
    }
  ]
}
export default tableRouter
