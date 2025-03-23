import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(sessionStorage.getItem('user')) || null);

  const changeUser = (value) => {
    user.value = value;
    sessionStorage.setItem('user', JSON.stringify(value));
  };

  const clearStore = () => {
    user.value = null;
    sessionStorage.removeItem('user');
  };

  return { user, changeUser, clearStore };
});
