import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('sp-user')) || '');

  const changeUser = (value) => {
    user.value = value;
    localStorage.setItem('sp-user', JSON.stringify(value));
  };

  const clearStore = () => {
    user.value = null;
    localStorage.removeItem('sp-user');
  };

  return { user, changeUser, clearStore };
});
