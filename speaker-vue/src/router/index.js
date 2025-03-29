import { createRouter, createWebHistory } from 'vue-router';
import { user_service } from '@/apis/user_service';
import { _isMobile } from '@/utils/isMobile';
import { useYiyuStore } from '@/stores/yiyu';
import { clearAllStores } from '@/utils/clearAllStores';

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
      name: 'debate',
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
      name: 'privacy',
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
          name: 'models',
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
          path: 'interpretation',
          redirect: '/interpretation/1',
        },
        {
          path: 'interpretation/:id',
          name: 'interpretation',
          component: () => import('@/views/Implents/Interpretation.vue'),
        },
      ],
    },
  ],
});

// 权限验证;
router.beforeEach(async (to, from, next) => {
  const yiyuStore = useYiyuStore();
  if (to?.meta?.requireAuth) {
    try {
      const res = await user_service.check();
      if (res.code !== '200') {
        clearAllStores();
        return next('/login'); // 确保只调用一次 next()
      }
      if (_isMobile() && yiyuStore.isSuccess) yiyuStore.clearYiyu();
      next();
    } catch {
      clearAllStores();
      return next('/login');
    }
  } else {
    if (_isMobile() && yiyuStore.isSuccess) yiyuStore.clearYiyu();
    next();
  }
});

export default router;
