import { createRouter, createWebHistory } from 'vue-router';
import { useUlCounterStore } from '@/stores/ulCounter';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

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
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/implents',
      component: () => import('@/views/Implents/Index.vue'),
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: '', // 设置默认子路由
          redirect: '/implents/models',
        },
        {
          path: 'models',
          component: () => import('@/views/Implents/Models/Index.vue'),
          children: [
            {
              path: '', // 设置默认子路由
              redirect: '/implents/models/myModels',
            },
            {
              path: 'myModels',
              component: () => import('@/views/Implents/Models/MyModels.vue'),
            },
            {
              path: 'newModels',
              component: () => import('@/views/Implents/Models/NewModels.vue'),
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

// 权限验证
router.beforeEach((to, from, next) => {
  if (to?.meta?.requireAuth) {
    // request
    //   .get('/api/check')
    //   .then((res) => {
    //     if (res.code != 200) {
    //       next('/login');
    //       return;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     ElMessage.error(err.message);
    //     // ...
    //     return;
    //   });
  }
  next();
});

export default router;
