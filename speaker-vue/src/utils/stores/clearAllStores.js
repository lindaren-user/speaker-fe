import { useUserStore } from '@/stores/user.js';
import { useProcessedModelStore } from '@/stores/processedModel';
import { useUsedModelsStore } from '@/stores/usedModels';
import { useYiyuStore } from '@/stores/yiyu';
import { useUlCounterStore } from '@/stores/ulCounter';

export const clearAllStores = () => {
  useUserStore().clearStore();
  useProcessedModelStore().clearStore();
  useUsedModelsStore().clearStore();
  useYiyuStore().clearYiyu();
  useUlCounterStore().clearStore();
};
