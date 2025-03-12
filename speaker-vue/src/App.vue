<template>
  <span class="fixed-nav">
    <div class="header">
      <div class="logo">
        <i class="iconfont icon-siyecao1"></i>
        <strong>Speaker</strong>
      </div>

      <div class="navbar-left">
        <RouterLink to="/" active-class="my-active-class" class="nav-item">
          <el-icon><House /></el-icon> 首页
        </RouterLink>
        <RouterLink to="/implents" active-class="my-active-class" class="nav-item">
          <el-icon><Monitor /></el-icon> 应用
        </RouterLink>
        <RouterLink to="/share" active-class="my-active-class" class="nav-item">
          <el-icon><Link /></el-icon> 分享
        </RouterLink>
        <RouterLink to="/debate" active-class="my-active-class" class="nav-item">
          <el-icon><ChatRound /></el-icon> 讨论
        </RouterLink>
      </div>

      <div class="navbar-right">
        <template v-if="!userStore.user">
          <RouterLink to="/login" active-class="my-active-class" class="nav-item"
            ><el-icon><User /></el-icon> 登录</RouterLink
          >
          <RouterLink to="/register" active-class="my-active-class" class="nav-item"
            >注册</RouterLink
          >
        </template>
        <template v-else>
          <el-button
            @click="notifyDrawer = true"
            style="display: flex; align-items: center; margin-right: 2vh; margin-top: 8px"
            round
            >消息
          </el-button>
          <el-dropdown>
            <span class="welcome">
              <span>欢迎：</span>
              <span class="username">{{ userStore.user }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="getPrivacyInfo">个人信息</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>

    <el-divider content-position="left" class="divider">
      <span>灵眸智译</span>
    </el-divider>
  </span>

  <el-drawer v-model="notifyDrawer" :with-header="false">
    <span>暂无消息</span>
  </el-drawer>

  <div class="content">
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
import request from './utils/request';

const userStore = useUserStore();
const router = useRouter();
const notifyDrawer = ref(false);

const logout = () => {
  request
    .get('/api/quit')
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('退出成功');
        console.log('登出');
        userStore.logout();
        router.push('/');
      }
    })
    .catch((err) => console.log(err));
};

const getPrivacyInfo = () => {
  console.log('个人');
  router.push('/privacy');
};
</script>

<style scoped>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white; /* 可以根据需要修改背景颜色 */
  z-index: 1000; /* 确保导航栏在其他元素之上 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 25px;
  color: #229453;
}

.logo .iconfont {
  font-size: 28px;
  margin-right: 8px;
}

.navbar-left {
  display: flex;
  gap: 50px;
  flex-grow: 7.5;
  margin-left: 30px;
}

.navbar-right {
  display: flex;
  gap: 30px;
  justify-content: flex-end;
  flex-grow: 2.5;
}

.nav-item {
  color: grey;
  font-size: 18px;
  text-decoration: none;
}

.nav-item:hover {
  color: #66c18c;
}

.my-active-class {
  color: #66c18c;
}

.content {
  margin-top: 120px;
}

.el-divider span {
  font-size: 15px;
  color: #20894d;
}

:deep(.el-divider) {
  margin: 10px;
}

.welcome {
  margin: auto 0;
  font-size: 20px;
  cursor: default;
}

:deep(.el-button:hover) {
  background-color: #66c18c !important;
  color: white !important;
}

:deep(.el-dropdown-menu__item) {
  width: 100px !important;
  text-align: center;
  font-size: 15px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: rgb(242, 244, 243) !important;
  color: black !important;
}
</style>
