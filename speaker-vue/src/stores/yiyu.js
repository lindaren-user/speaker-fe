import { defineStore } from 'pinia';
import { ref } from 'vue';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

export const useYiyuStore = defineStore('yiyu', () => {
  const isSuccess = ref(false);

  try {
    yiyu.init({
      name: 'Jop+waWe6cOFzz92RpqptN/D029oP9i81SifDLndpFFqqh0s93JRBZzWWWouTNMFOfotGPcyaDRJ+T/cUjwosfwYM9IqCEajgNSRJaxnykb2eOEAp5CrNFrq2Mmrv8BktC8SdK008WoBYGqlJgza+tFtLxVQNRY2YSTzJkcetbY=',
      readLocalResource: false,
      // draggable: false,
    });

    yiyu.onAppReady(() => {
      yiyu.disableYiyuApp();

      isSuccess.value = true;
      console.log('yiyu 初始化成功');
    });
  } catch (err) {
    console.error('yiyu 初始化失败', err);
  }

  return {
    isSuccess,
    yiyu,
  };
});
