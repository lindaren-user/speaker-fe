<template>
  <el-card class="lCard" style="width: 35vw">
    <div class="center">
      <el-input v-model="text" placeholder="输入文本......" show-word-limit type="textarea" />
      <div class="btn">
        <el-button type="danger" @click="clearText">清空</el-button>
        <el-button type="primary" :disabled="text == ''">转化</el-button>
      </div>
    </div>
  </el-card>
  <el-card class="rCard" style="width: 45vw">手语机器人</el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const text = ref('');

const clearText = () => {
  text.value = '';
};
</script>

<style scoped>
:deep(.el-textarea__inner) {
  height: 300px;
}

.lCard {
  height: 70vh !important;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-right: 10px;
}

.rCard {
  height: 78vh !important;
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
  margin-top: 10vh;
}
</style>
