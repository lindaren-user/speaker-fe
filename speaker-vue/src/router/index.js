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
      component: () => import('@/views/Implents/index.vue'),
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
          redirect: '/implents/dataset',
        },
        {
          path: 'dataset',
          component: () => import('@/views/Implents/DataSet.vue'),
        },
        {
          path: 'infer',
          component: () => import('@/views/Implents/Infer.vue'),
        },
        {
          path: 'tag',
          component: () => import('@/views/Implents/Tag.vue'),
          beforeEnter: (to, from, next) => {
            useUlCounterStore().clearCounter();
            next();
          },
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
