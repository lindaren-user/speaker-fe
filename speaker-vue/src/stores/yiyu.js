import { defineStore } from 'pinia';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

export const useYiyuStore = defineStore('yiyu', () => {
  const isSuccess = ref(false);

  try {
    yiyu.init({
      name: 'Jop+waWe6cOFzz92RpqptN/D029oP9i81SifDLndpFFqqh0s93JRBZzWWWouTNMFOfotGPcyaDRJ+T/cUjwosfwYM9IqCEajgNSRJaxnykb2eOEAp5CrNFrq2Mmrv8BktC8SdK008WoBYGqlJgza+tFtLxVQNRY2YSTzJkcetbY=',
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
