<template>
  <el-card class="lCard">
    <template #header> 目标文本 </template>
    <AudioRecorder @record-complete="handleRecordComplete" />
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
      <li>
        <span> 跟随翻译 </span>
        <el-switch
          v-model="canFollow"
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
import { ref, useTemplateRef, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import AudioRecorder from '../Recorders/AudioRecorder.vue';
import { useYiyuStore } from '@/stores/yiyu';

const text = ref('');
const isCanceled = ref(false);
const dialogVisible = ref(false);
const speed = ref(1.5);
const rCard = useTemplateRef('rCard');
const { width: winWidth, height: winHeight } = useWindowSize();

let yiyuStore = useYiyuStore();
let yiyu = yiyuStore.yiyu;

// 默认设置
const sliderValue = ref(25);
const canTextTranslate = ref(true);
const canFollow = ref(true);

// 数字人的基本属性
const yiyuHeight = 427.5;
const yiyuWeight = 332.5;

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
  canTextTranslate.value = true;
  canFollow.value = true;
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

  const centerX = left.value + width.value / 2;
  const centerY = top.value + height.value / 2;

  return { centerX, centerY };
};

const updateAvatarPosition = () => {
  const { centerX, centerY } = getCardCenter();
  yiyu.setPosition(`${centerY - yiyuHeight / 2}px`, `${centerX - yiyuWeight / 2}px`);
};

const handleRecordComplete = (blob) => {
  // 处理音频
};

onMounted(async () => {
  await nextTick(); // 等待 DOM 更新完成

  updateAvatarPosition();
  yiyu.enableYiyuApp();

  if (!canTextTranslate.value) yiyu.disableTextSelection();
});

onUnmounted(() => {
  if (yiyuStore.isSuccess) {
    yiyu.disableYiyuApp();
  }
});

// 监听窗口变化，动态调整位置
watch([winWidth, winHeight], () => {
  console.log(7666);
  updateAvatarPosition();
});
</script>

<style scoped>
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
  height: 18.75rem;
}

.lCard {
  height: 40.625rem !important;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
}

.rCard {
  height: 40.625rem !important;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
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
  margin-top: 2vh;
}
</style>
