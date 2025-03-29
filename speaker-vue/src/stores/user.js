import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const changeUser = (value) => {
    user.value = value;
    localStorage.setItem('user', JSON.stringify(value));
  };

  const clearStore = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  return { user, changeUser, clearStore };
});
