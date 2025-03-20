import { defineStore } from 'pinia';
import { ref } from 'vue';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

export const useYiyuStore = defineStore('yiyu', () => {
  const isInitialized = ref(false);
  const isSuccess = ref(false);

  const initializeYiyu = async () => {
    if (isInitialized.value) {
      console.log('yiyu 已初始化，跳过重复调用');
      return;
    }

    try {
      await yiyu.init({
        name: 'UuqwgIrBdzIHx5/KgtODVgK437EK3vkCmRicvp7aMM9/GztABnmLT1KCsbFScroCC9XmCrOAirTu/pKE+mNzW4SW1YorxkvzC2BQq0ihZFXrbJXjRPrFrO72xS6+rPkrx+YT7JqA/jhef/ElJbuYGH12H7MhvGu4+AkCAAZrcN0=',
        readLocalResource: false,
        draggable: false,
      });

      yiyu.onAppReady(() => {
        isSuccess.value = true;
        isInitialized.value = true;
        console.log('yiyu 初始化成功');
      });
    } catch (err) {
      console.error('yiyu 初始化失败', err);
    }
  };

  return {
    isInitialized,
    isSuccess,
    initializeYiyu,
    yiyu,
  };
});
