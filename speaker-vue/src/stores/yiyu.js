import { defineStore } from 'pinia';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

export const useYiyuStore = defineStore('yiyu', () => {
  const isSuccess = ref(false);

  try {
    yiyu.init({
      name: import.meta.env.VITE_YIYU_KEY,
      readLocalResource: false,
      draggable: false, // 不可拖拽
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
