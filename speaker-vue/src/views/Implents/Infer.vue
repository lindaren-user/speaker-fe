<template>
  <el-card class="infer-card">
    <template #header>
      <div class="header">
        <strong>模型训练</strong>
        <el-button type="success" @click="train" v-if="!started">开始训练</el-button>
      </div>
    </template>
    <div class="infer">
      <div class="progress-icon-container" v-if="showProgress">
        <!-- 进度条 -->
        <el-progress
          :percentage="percentage"
          :stroke-width="15"
          status="success"
          striped
          striped-flow
          :duration="10"
          style="width: 90%; transition: width 1s ease"
        />
        <!-- 显示百分比 -->
        <div class="percentage-label">{{ percentage }}%</div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/utils/request';

const started = ref(false); // 控制整个过程的开始
const showIcon = ref(false); // 控制图标显示
const showProgress = ref(false); // 控制进度条显示
const percentage = ref(0); // 进度条的百分比

const train = () => {
  // 隐藏按钮
  started.value = true;

  // 延迟显示图标和进度条，以确保按钮隐藏后再开始动画
  showIcon.value = true;
  showProgress.value = true;
  startProgress();
};

const startProgress = () => {
  request
    .get('/api/train')
    .then((res) => {
      if (res.code == 200) {
        percentage.value += 4;
        ElMessage({
          showClose: true,
          type: 'success',
          message: '训练成功',
        });
      } else {
        ElMessage.error('训练失败');
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error('训练失败');
    });

  let kk = 0;
  const interval = setInterval(() => {
    if (kk >= 24) {
      clearInterval(interval);
    } else {
      percentage.value += 4;
      kk++;
    }
  }, 100);
};
</script>

<style scoped>
.infer-card {
  width: 55vw;
  margin: 4vh auto;
}

.progress-icon-container {
  position: relative; /* 确保子元素相对定位 */
  width: 50vw;
  padding: 0;
  margin: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

.icon-container {
  position: absolute;
  left: 0;
  transform: translateX(-50%); /* 中心点对齐左侧边缘 */
  transition: left 3s ease; /* 平滑过渡left属性 */
}

.gun {
  font-size: 100px;
  color: green;
}

.move {
  animation: move-animation 3s forwards;
}

@keyframes move-animation {
  0% {
    left: 0;
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    left: 80%; /* 移动到父容器80%宽度处 */
    transform: translateX(-50%) rotate(720deg);
  }
}

.el-progress {
  width: 80%;
  margin: 0; /* 去除默认外边距 */
}

.percentage-label {
  position: absolute;
  right: 0; /* 将百分比显示在右侧 */
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}
</style>
