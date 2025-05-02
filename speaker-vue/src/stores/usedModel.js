import { defineStore } from 'pinia';

export const useUsedModelStore = defineStore('usedModel', () => {
  const usedModel = ref(JSON.parse(localStorage.getItem('sp-usedModel')) || -1);

  const changeUsedModel = (value) => {
    usedModel.value = value;
    localStorage.setItem('sp-usedModel', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('sp-usedModel');
  };

  return { usedModel, changeUsedModel, clearStore };
});
