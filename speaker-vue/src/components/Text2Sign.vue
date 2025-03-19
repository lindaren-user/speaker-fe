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
          <el-button type="primary" :disabled="!text || !isSuccess" @click="startTranslation">
            <el-icon><Switch /></el-icon> 转化
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="rCard" ref="rCard">
      <template #header>
        <div class="header">
          <span>手语数字人</span>
          <el-button round @click="dialogVisible = true" :disabled="!isSuccess"
            ><el-icon><Setting /></el-icon> 设置</el-button
          >
        </div>
      </template>
    </el-card>
  </div>

  <!-- 设置 -->
  <el-dialog
    v-model="dialogVisible"
    title="设置"
    width="30%"
    draggable
    :close-on-click-modal="false"
  >
    <ul>
      <li>
        <span>手语翻译速度 x{{ speed }}</span>
        <el-slider
          v-model="sliderValue"
          :format-tooltip="formatTooltip"
          size="small"
          class="slider"
        />
      </li>
      <li>
        <span> 划词翻译 </span>
        <el-switch
          v-model="canTextTranslate"
          size="small"
          inline-prompt
          active-text="开"
          inactive-text="关"
        />
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetSettings">重置</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, useTemplateRef, watch, onDeactivated, onActivated } from 'vue';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { yiyu } from 'https://avatar.gbqr.net/yiyu.js';

const text = ref('');
const isSuccess = ref(false);
const isCanceled = ref(false);
const dialogVisible = ref(false);
const speed = ref(1.5);
const rCard = useTemplateRef('rCard');
const { width: winWidth, height: winHeight } = useWindowSize();

// 设置
const sliderValue = ref(25);
const canTextTranslate = ref(false);

const saveSettings = () => {
  dialogVisible.value = false;

  yiyu.modifyPlaySpeed(speed.value);

  if (canTextTranslate.value) yiyu.enableTextSelection();
  else yiyu.disableTextSelection();

  ElMessage({
    showClose: true,
    type: 'success',
    message: '设置成功',
  });
};

const resetSettings = () => {
  sliderValue.value = 25;
  canTextTranslate.value = false;
};

const formatTooltip = (val) => {
  speed.value = (1 + val / 50).toFixed(1);
  return speed.value;
};

const clearText = () => {
  text.value = '';
};

// 调用 SDK 进行手语翻译
const startTranslation = () => {
  if (isCanceled.value) yiyu.cancelTranslation();

  yiyu.startTranslate(text.value);
};

const getCardCenter = () => {
  const { width, height, left, top } = useElementBounding(rCard);

  const centerX = top.value + height.value / 2;
  const centerY = left.value + width.value / 2;
  return { centerX, centerY };
};

const updateAvatarPosition = () => {
  const { centerX, centerY } = getCardCenter();
  yiyu.setPosition(`${centerX - 200}px`, `${centerY - 140}px`);
};

onMounted(() => {
  try {
    yiyu.init({
      name: 'UuqwgIrBdzIHx5/KgtODVgK437EK3vkCmRicvp7aMM9/GztABnmLT1KCsbFScroCC9XmCrOAirTu/pKE+mNzW4SW1YorxkvzC2BQq0ihZFXrbJXjRPrFrO72xS6+rPkrx+YT7JqA/jhef/ElJbuYGH12H7MhvGu4+AkCAAZrcN0=',
      readLocalResource: false,
      draggable: false,
    });

    ElMessage({
      duration: 1000,
      type: 'warning',
      message: '正在准备"手语数字人"...',
    });

    // 数字人加载完毕时
    yiyu.onAppReady(() => {
      isSuccess.value = true;

      updateAvatarPosition();

      yiyu.setAvatarSize(1);

      ElMessage({
        showClose: true,
        type: 'success',
        message: '"手语数字人"加载成功',
      });
      yiyu.startTranslate('你好，朋友');
    });
  } catch (err) {
    console.log(err);
    ElMessage.error('初始化"手语数字人"时发生错误');
  }
});

onActivated(() => {
  if (isSuccess.value) {
    yiyu.enableYiyuApp();

    if (!canTextTranslate.value) yiyu.disableTextSelection();
  }
});

onDeactivated(() => {
  if (isSuccess.value) {
    yiyu.disableYiyuApp();
  }
});

// 监听窗口变化，动态调整位置
watch([winWidth, winHeight], () => {
  updateAvatarPosition();
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

li {
  list-style: none;
  height: 5vh;
  text-align: 5vh;
  display: flex;
  justify-content: space-between;
}

.slider {
  width: 50%;
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
  margin-right: 30px;
}

.rCard {
  width: 40vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
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
