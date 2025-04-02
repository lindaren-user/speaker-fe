import { defineStore } from 'pinia';

export const useUsedModelsStore = defineStore('usedModels', () => {
  const usedModels = ref(JSON.parse(localStorage.getItem('sp-usedModels')) || []);

  const changeUsedModels = (value) => {
    usedModels.value = value;
    localStorage.setItem('sp-usedModels', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('sp-usedModels');
  };

  return { usedModels, changeUsedModels, clearStore };
});
