<template>
  <div class="container">
    <el-card class="lCard">
      <template #header>
        <span>目标文本</span>
      </template>
      <div class="center">
        <el-input
          v-model="text"
          placeholder="输入文本......"
          show-word-limit
          type="textarea"
          maxlength="450"
        />
        <div class="btn">
          <el-button type="danger" @click="clearText">
            <el-icon><Delete /></el-icon> 清空
          </el-button>
          <el-button type="primary" :disabled="!text" @click="startTranslation">
            <el-icon><Switch /></el-icon> 转化
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 右侧手语机器人 -->
    <el-card class="rCard">
      <template #header>手语数字人</template>
      <div id="sign-language-bot"></div>
      <!-- 存放手语数字人 -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

const text = ref('');

const clearText = () => {
  text.value = '';
};

// 调用 SDK 进行手语翻译
const startTranslation = () => {
  yiyu.cancelTranslation();
  yiyu.startTranslate(text.value);
};

onMounted(() => {
  try {
    yiyu.init({
      name: 'UuqwgIrBdzIHx5/KgtODVgK437EK3vkCmRicvp7aMM9/GztABnmLT1KCsbFScroCC9XmCrOAirTu/pKE+mNzW4SW1YorxkvzC2BQq0ihZFXrbJXjRPrFrO72xS6+rPkrx+YT7JqA/jhef/ElJbuYGH12H7MhvGu4+AkCAAZrcN0=',
      readLocalResource: false,
    });
    yiyu.setPosition('20%', '40%');

    ElMessage.warning('正在准备"手语数字人"...');
    yiyu.startTranslate('你好，我的朋友');
  } catch (error) {
    ElMessage.error('初始化"手语数字人"时发生错误');
    console.error(error);
  }
});

onUnmounted(() => {
  yiyu.disableYiyuApp();
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

:deep(.el-textarea__inner) {
  height: 300px;
}

.lCard {
  width: 35vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-right: 10px;
}

.rCard {
  width: 45vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.btn {
  margin-top: 5vh;
  display: flex;
  justify-content: space-around;
}

.center {
  margin-top: 5vh;
}
</style>
