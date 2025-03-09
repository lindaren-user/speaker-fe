import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const changeUser = (value) => {
    user.value = value;
    localStorage.setItem("user", JSON.stringify(value));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  return { user, changeUser, logout };
});