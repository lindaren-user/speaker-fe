import { createRouter, createWebHistory } from 'vue-router';
import { user_service } from '@/apis/user_service';
import { _isMobile } from '@/utils/mobile/isMobile';
import { useYiyuStore } from '@/stores/yiyu';
import { clearAllStores } from '@/utils/stores/clearAllStores';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '首页',
      },
    },
    {
      path: '/share',
      component: () => import('@/views/Share.vue'),
      meta: {
        title: '分享',
      },
    },
    {
      path: '/debate',
      name: 'debate',
      component: () => import('@/views/Debate.vue'),
      meta: {
        title: '讨论',
      },
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/register',
      component: () => import('@/views/Register.vue'),
      meta: {
        title: '注册',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/Privacy.vue'),
      meta: {
        title: '个人信息',
        requireAuth: true,
      },
    },
    {
      path: '/implents',
      component: () => import('@/views/Implents/Index.vue'),
      meta: {
        title: '应用',
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
router.beforeEach(async (to) => {
  // const yiyuStore = useYiyuStore();

  // 设置标题
  if (to.meta.title) {
    document.title = '灵眸智译 - ' + to.meta.title;
  } else {
    document.title = '灵眸智译';
  }

  if (to?.meta?.requireAuth) {
    try {
      const res = await user_service.check();
      if (res.code !== '200') {
        clearAllStores();
        return '/login';
      }
      // if (_isMobile() && yiyuStore.isSuccess) yiyuStore.clearYiyu();
    } catch {
      clearAllStores();
      return '/login';
    }
  } else {
    // if (_isMobile() && yiyuStore.isSuccess) yiyuStore.clearYiyu();
  }
});

export default router;
