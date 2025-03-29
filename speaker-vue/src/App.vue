<template>
  <div v-if="isMobile">
    <div style="height: 92vh; overflow: hidden">
      <RouterView />
    </div>
    <div v-if="isLogin">
      <div>
        <van-tabbar route class="van-tabbar">
          <van-tabbar-item icon="points" to="/implents/models">模型</van-tabbar-item>
          <van-tabbar-item
            :class="isActive ? 'van-tabbar-item--active' : ''"
            icon="search"
            to="/implents/interpretation/1"
            :aria-selected="isActive"
            >翻译</van-tabbar-item
          >
          <van-tabbar-item icon="friends-o" to="/debate">讨论</van-tabbar-item>
          <van-tabbar-item icon="user-o" to="/privacy">我的</van-tabbar-item>
        </van-tabbar>
      </div>
    </div>
  </div>

  <div v-else>
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
              ><el-icon><Check /></el-icon> 注册</RouterLink
            >
          </template>
          <template v-else>
            <el-button @click="notifyDrawer = true" class="msgBtn" round
              ><el-icon><Message /></el-icon>&nbsp;消息
            </el-button>
            <el-dropdown>
              <span class="welcome">
                <span>欢迎：</span>
                <span class="username">{{ userStore.user }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="getPrivacyInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="logout(router)">退出登录</el-dropdown-item>
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
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js';
import { _isMobile } from '@/utils/isMobile';
import { logout } from './utils/logout';

/* 公共变量 */
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

/* 移动端 */
const isMobile = computed(() => _isMobile());
const isActive = computed(() => route.path.startsWith('/implents/interpretation'));
const isLogin = computed(() => userStore.user !== null);

/* pc端 */
const notifyDrawer = ref(false);

/* 函数 */
const getPrivacyInfo = () => {
  console.log('个人');
  router.push('/privacy');
};
</script>

<style scoped>
.fixed-nav {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1000;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  height: 3.5rem;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5625rem;
  color: #229453;
}

.logo .iconfont {
  font-size: 1.75rem;
  margin-right: 0.5rem;
}

.navbar-left {
  display: flex;
  gap: 3.125rem;
  flex-grow: 7.5;
  margin-left: 1.875rem;
}

.navbar-right {
  display: flex;
  gap: 1.875rem;
  justify-content: flex-end;
  flex-grow: 2.5;
}

.nav-item {
  color: grey;
  font-size: 1.125rem;
  text-decoration: none;
}

.nav-item:hover {
  color: #66c18c;
}

.my-active-class {
  color: #66c18c;
}

.content {
  margin-top: 5vh;
}

.msgBtn {
  display: flex;
  align-items: center;
  margin-right: 2vh;
  margin-top: 0.5rem;
}

.el-divider span {
  font-size: 0.9375rem;
  color: #20894d;
}

:deep(.el-divider) {
  margin: 0.625rem;
}

.welcome {
  margin: auto 0;
  font-size: 1.25rem;
  cursor: default;
}

.van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

:deep(.el-button:hover) {
  border: 0.0625rem solid #66c18c !important;
  background-color: #66c18c !important;
  color: white !important;
}

:deep(.el-dropdown-menu__item) {
  width: 6.25rem !important;
  text-align: center;
  font-size: 0.9375rem;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: rgb(242, 244, 243) !important;
  color: black !important;
}
</style>
