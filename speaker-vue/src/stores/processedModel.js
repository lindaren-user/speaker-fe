import { defineStore } from 'pinia';

export const useProcessedModelStore = defineStore('processedModel', () => {
  const processedModel = ref(JSON.parse(localStorage.getItem('sp-processedModel')) || null);

  const changeProcessedModel = (value) => {
    processedModel.value = value;
    localStorage.setItem('sp-processedModel', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('sp-processedModel');
  };

  return { processedModel, changeProcessedModel, clearStore };
});
