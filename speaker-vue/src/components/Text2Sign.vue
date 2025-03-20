<template>
  <div class="container">
    <el-card class="lCard">
      <template #header>
        <span style="float: left">目标文本</span>
        <span style="float: right"> <AudioRecorder @record-complete="handleRecordComplete" /></span>
      </template>
      <div class="center">
        <el-input
          v-model="text"
          placeholder="输入文本......"
          show-word-limit
          type="textarea"
          maxlength="450"
          resize="none"
        />
        <div class="btn">
          <el-button type="danger" @click="clearText">
            <el-icon><Delete /></el-icon> 清空
          </el-button>
          <el-button
            type="primary"
            :disabled="!text || !yiyuStore.isSuccess"
            @click="startTranslation"
          >
            <el-icon><Switch /></el-icon> 转化
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="rCard" ref="rCard">
      <template #header>
        <div class="header">
          <span>手语数字人</span>
          <el-button round @click="dialogVisible = true" :disabled="!yiyuStore.isSuccess"
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
import { ref, useTemplateRef, watch, onDeactivated, onActivated } from 'vue';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import AudioRecorder from './AudioRecorder.vue';
import { useYiyuStore } from '@/stores/yiyu';

const text = ref('');
const isCanceled = ref(false);
const dialogVisible = ref(false);
const speed = ref(1.5);
const rCard = useTemplateRef('rCard');
const { width: winWidth, height: winHeight } = useWindowSize();

const yiyuStore = useYiyuStore();
let yiyu = yiyuStore.yiyu;

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

const handleRecordComplete = (blob) => {
  // 处理音频
};

onActivated(() => {
  if (yiyuStore.isSuccess) {
    yiyu.enableYiyuApp();

    if (!canTextTranslate.value) yiyu.disableTextSelection();
  }
});

onDeactivated(() => {
  if (yiyuStore.isSuccess) {
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
