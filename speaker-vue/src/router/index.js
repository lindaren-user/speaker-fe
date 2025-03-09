import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/share',
      component: () => import('@/views/Share.vue')
    },
    {
      path: '/debate',
      component: () => import('@/views/Debate.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/privacy',
      component: () => import('@/views/Privacy.vue')
    },
    {
      path: '/implents',
      component: () => import('@/views/Implents/index.vue'),
      children: [
        {
          path: 'dataset',
          component: () => import('@/views/Implents/DataSet.vue')
        },
        {
          path: 'infer',
          component: () => import('@/views/Implents/Infer.vue')
        },
        {
          path: 'tag',
          component: () => import('@/views/Implents/Tag.vue')
        },
        {
          path: 'share',
          component: () => import('@/views/Implents/Share.vue')
        }
      ]
    }
  ],
})

export default router