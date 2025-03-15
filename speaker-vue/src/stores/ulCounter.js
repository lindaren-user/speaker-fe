import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUlCounterStore = defineStore('ulCounter', () => {
  const ulCounter = ref(JSON.parse(localStorage.getItem('ulCounter')) || 0);

  const changeCounter = (value) => {
    ulCounter.value += value;
    localStorage.setItem('ulCounter', JSON.stringify(ulCounter.value));
  };

  const clearCounter = () => {
    ulCounter.value = 0;
    localStorage.removeItem('ulCounter');
  };

  return { ulCounter, changeCounter, clearCounter };
});
