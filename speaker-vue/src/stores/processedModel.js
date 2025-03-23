import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProcessedModelStore = defineStore('processedModel', () => {
  const processedModel = ref(JSON.parse(localStorage.getItem('processedModel')) || null);

  const changeProcessedModel = (value) => {
    processedModel.value = value;
    localStorage.setItem('processedModel', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('processedModel');
  };

  return { processedModel, changeProcessedModel, clearStore };
});
