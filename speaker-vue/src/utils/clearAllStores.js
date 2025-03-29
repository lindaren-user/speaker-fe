import { useUserStore } from '@/stores/user.js';
import { useProcessedModelStore } from '@/stores/processedModel';
import { useUsedModelStore } from '@/stores/usedModel';
import { useYiyuStore } from '@/stores/yiyu';
import { useUlCounterStore } from '@/stores/ulCounter';

export const clearAllStores = () => {
  useUserStore().clearStore();
  useProcessedModelStore().clearStore();
  useUsedModelStore().clearStore();
  useYiyuStore().clearYiyu();
  useUlCounterStore().clearStore();
};
