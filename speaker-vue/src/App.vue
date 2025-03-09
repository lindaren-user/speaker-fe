<template>
  <span class="fixed-nav">
    <div class="header">
      <div class="logo">
        <i class="iconfont icon-siyecao1"></i>
        <span>Speaker</span>
      </div>

      <div class="navbar-left">
        <RouterLink to="/" active-class="my-active-class" class="nav-item">
          <i class="iconfont icon-homefill"></i> 首页
        </RouterLink>
        <RouterLink to="/implents/dataset" active-class="my-active-class" class="nav-item">
          应用
        </RouterLink>
        <RouterLink to="/share" active-class="my-active-class" class="nav-item">
          分享
        </RouterLink>
        <RouterLink to="/debate" active-class="my-active-class" class="nav-item">
          讨论
        </RouterLink>
      </div>

      <div class="spacer"></div>

      <div class="navbar-right">
        <template v-if="user.username">
          <RouterLink to="/login" active-class="my-active-class" class="nav-item">登录</RouterLink>
          <RouterLink to="/register" active-class="my-active-class" class="nav-item">注册</RouterLink>
        </template>
        <template v-else>
          <el-button @click="notifyDrawer = true" style="display:flex; align-items: center; margin-right: 5vh;" round>消息
          </el-button>
          <el-dropdown>
            <span class="el-dropdown-link">{{ `欢迎：${user.username}` }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="getPrivacyInfo">个人信息</el-dropdown-item>
                <el-dropdown-item @click="exitIndex">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>

    <el-divider content-position="left">
      <span>灵眸智译</span>
    </el-divider>
  </span>

  <el-drawer v-model="notifyDrawer" :with-header="false">
      <span>暂无消息</span>
  </el-drawer>

  <div class="content">
    <RouterView/>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/user.js';

const user = useUserStore();
const router = useRouter();
const notifyDrawer = ref(false);

const exitIndex = () => {
  console.log("登出");
  router.push("/");
};

const getPrivacyInfo = () => {
  console.log("个人");
  router.push("/privacy");
}
</script>

<style scoped>
/* General Styles */
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
  font-size: 17px;
  color: #229453;
}

.logo .iconfont {
  font-size: 28px;
  margin-right: 8px;
}

.navbar-left{
  display: flex;
  /* 增大右侧导航栏选项间距 */
  gap: 50px; 
  flex-grow: 7.5;
  margin-left: 20px;
}

.navbar-right {
  display: flex;
  /* 增大左侧导航栏选项间距 */
  gap: 30px; 
  justify-content: flex-end;
  flex-grow: 2.5;
}

/* 增大导航栏字体大小 */
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

.spacer {
  flex-grow: 1;
}

.content {
  height: 100%;
  padding: 20px;
  margin-top: 100px; 
}

.el-divider span {
  font-size: 20px;
  color: #20894d;
}
</style>