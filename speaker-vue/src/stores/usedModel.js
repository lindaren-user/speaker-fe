import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUsedModelStore = defineStore('usedModel', () => {
  const usedModel = ref(JSON.parse(localStorage.getItem('usedModel')) || {});

  const changeUsedModel = (value) => {
    usedModel.value = value;
    localStorage.setItem('usedModel', JSON.stringify(value));
  };

  const clearStore = () => {
    localStorage.removeItem('usedModel');
  };

  return { usedModel, changeUsedModel, clearStore };
});
