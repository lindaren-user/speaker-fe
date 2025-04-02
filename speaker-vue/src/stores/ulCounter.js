import { defineStore } from 'pinia';

export const useUlCounterStore = defineStore('ulCounter', () => {
  const ulCounter = ref(JSON.parse(localStorage.getItem('sp-ulCounter')) || 0);

  const changeCounter = (value) => {
    ulCounter.value += value;
    localStorage.setItem('sp-ulCounter', JSON.stringify(value));
  };

  const clearStore = () => {
    ulCounter.value = 0;
    localStorage.removeItem('sp-ulCounter');
  };

  return { ulCounter, changeCounter, clearStore };
});
