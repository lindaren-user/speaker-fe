import { defineStore } from 'pinia';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

export const useYiyuStore = defineStore('yiyu', () => {
  const isSuccess = ref(false);

  try {
    yiyu.init({
      name: 'F2fJg0+ypmOAyq0qrhBOYhDWwHhqdpk0j9eeR/rInUzzQhbLLGR7PWqLSDfA7bhJLw0ZawVLvl+eYa8hp94Dd/mDEY/6bjHbo1zDdfb7ceOyu1r1OqWa0QenMkej8RTmJGHQyZ3iYEMerj1IfZm8dFvGE+1F7PuexlfWoIJtP9c=',
      readLocalResource: false,
      // draggable: false, // 可否拖拽
    });

    yiyu.onAppReady(() => {
      yiyu.disableYiyuApp();

      isSuccess.value = true;
    });
  } catch (err) {
    console.error('yiyu 初始化失败', err);
  }

  const clearYiyu = () => {
    yiyu.disableYiyuApp();
  };

  return {
    isSuccess,
    yiyu,
    clearYiyu,
  };
});
