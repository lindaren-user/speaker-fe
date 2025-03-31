import { defineStore } from 'pinia';

export const useUsedModelsStore = defineStore('usedModels', () => {
  const usedModels = ref(JSON.parse(localStorage.getItem('usedModels')) || []);

  const changeUsedModels = (value) => {
    usedModels.value = value;
    localStorage.setItem('usedModels', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('usedModels');
  };

  return { usedModels, changeUsedModels, clearStore };
});
