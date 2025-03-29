<template>
  <div v-if="isMobile">
    <van-divider><span style="color: black; font-size: large">我的</span></van-divider>
    <van-cell-group>
      <van-cell title="退出登录" @click="logout(router)" />
    </van-cell-group>
  </div>

  <div v-else>
    <h1>This is an privacy page</h1>
  </div>
</template>

<script setup>
import { _isMobile } from '@/utils/isMobile';
import { logout } from '@/utils/logout';

/* 移动端 */
const isMobile = computed(() => _isMobile());
const router = useRouter();
</script>
