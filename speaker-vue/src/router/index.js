import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useUlCounterStore } from '@/stores/ulCounter';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/share',
      component: () => import('@/views/Share.vue'),
    },
    {
      path: '/debate',
      component: () => import('@/views/Debate.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/privacy',
      component: () => import('@/views/Privacy.vue'),
    },
    {
      path: '/implents',
      component: () => import('@/views/Implents/Index.vue'),
      beforeEnter: (to, from, next) => {
        if (useUserStore().user) {
          next();
        } else {
          next('/login');
        }
      },
      children: [
        {
          path: '', // 设置默认子路由
          redirect: '/implents/myModels',
        },
        {
          path: 'myModels',
          component: () => import('@/views/Implents/MyModels.vue'),
        },
        {
          path: 'models',
          component: () => import('@/views/Implents/Models/Index.vue'),
          children: [
            {
              path: 'dataset',
              component: () => import('@/views/Implents/Models/DataSet.vue'),
            },
            {
              path: 'infer',
              component: () => import('@/views/Implents/Models/Infer.vue'),
            },
            {
              path: 'tag',
              component: () => import('@/views/Implents/Models/Tag.vue'),
              beforeEnter: (to, from, next) => {
                useUlCounterStore().clearCounter();
                next();
              },
            },
          ],
        },
        {
          path: 'interpretation/:id',
          component: () => import('@/views/Implents/Interpretation.vue'),
        },
      ],
    },
  ],
});

export default router;
