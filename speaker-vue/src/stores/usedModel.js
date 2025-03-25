import { defineStore } from 'pinia';

export const useUsedModelStore = defineStore('usedModel', () => {
  const usedModel = ref(JSON.parse(localStorage.getItem('usedModel')) || null);

  const changeUsedModel = (value) => {
    usedModel.value = value;
    localStorage.setItem('usedModel', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('usedModel');
  };

  return { usedModel, changeUsedModel, clearStore };
});
