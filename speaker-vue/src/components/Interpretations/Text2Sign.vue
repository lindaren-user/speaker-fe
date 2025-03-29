<template>
  <div v-if="isMobile">
    <div style="height: 50vh; display: flex; gap: 2vw; justify-content: center">
      <span
        style="height: 50vh; width: 48vw; border: 1px solid lightgray; border-radius: 5%"
        ref="rCard"
        ><div style="margin-top: 60%">
          <van-loading v-show="loading" size="24px" vertical>数字人加载中...</van-loading>
        </div>
      </span>
      <span style="height: 50vh; width: 48vw; border: 1px solid lightgray; border-radius: 5%"
        ><van-cell-group inset>
          <van-field
            v-model="text"
            rows="11"
            autosize
            label="目标文本"
            type="textarea"
            maxlength="450"
            placeholder="请输入留言"
            show-word-limit
          />
        </van-cell-group>
      </span>
    </div>
    <div style="height: 10vh; display: flex; justify-content: center; gap: 5vh; margin-top: 2vh">
      <van-button type="warning" @click="clearText"><van-icon name="delete-o" /> 清空</van-button>
      <van-button type="success" @click="startTranslation" :disabled="!text || !yiyuStore.isSuccess"
        ><van-icon name="exchange" /> 转化</van-button
      >
    </div>
    <div style="height: 10vh; display: flex; justify-content: center; gap: 50px">
      <AudioRecorder @record-complete="handleRecordComplete" :isAudio2Text="isAudio2Text" />
    </div>
  </div>

  <div v-else class="body">
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

    <el-card
      class="rCard"
      ref="rCard"
      v-loading="loading"
      element-loading-text="正在加载手语数字人..."
    >
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
            v-model="newSliderValue"
            :format-tooltip="formatTooltip"
            size="small"
            class="slider"
          />
        </li>
        <li>
          <span> 划词翻译 </span>
          <el-switch
            v-model="newCanTextTranslate"
            size="small"
            inline-prompt
            active-text="开"
            inactive-text="关"
          />
        </li>
        <li>
          <span> 跟随翻译 </span>
          <el-switch
            v-model="newCanFollow"
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
  </div>
</template>

<script setup>
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { useYiyuStore } from '@/stores/yiyu';
import { files_service } from '@/apis/files_service';
import { ErrorMessage, SuccessMessage } from '@/utils/messageTool';
import { _isMobile } from '@/utils/isMobile';
import AudioRecorder from '@/components/Recorders/AudioRecorder.vue';

/* 公共变量 */
const text = ref('');
const speed = ref(1.5);
const rCard = useTemplateRef('rCard');
const { width: winWidth, height: winHeight } = useWindowSize();
const loading = ref(true);
const isAudio2Text = ref(false);

const yiyuStore = useYiyuStore();
const yiyu = yiyuStore.yiyu;

// 默认设置
const sliderValue = ref(25);
const canTextTranslate = ref(true);
const canFollow = ref(true);

// 新设置
const newSliderValue = ref(25);
const newCanTextTranslate = ref(false);
const newCanFollow = ref(false);

// 数字人的基本属性
const yiyuHeight = 427.5;
const yiyuWeight = 332.5;

/* 移动端 */
const isMobile = computed(() => _isMobile());

/* pc端 */
const isCanceled = ref(false);
const dialogVisible = ref(false);

/* 函数 */
const saveSettings = () => {
  dialogVisible.value = false;

  yiyu.modifyPlaySpeed(speed.value);

  if (canTextTranslate.value) yiyu.enableTextSelection();
  else yiyu.disableTextSelection();

  SuccessMessage('设置成功');
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

  let top;
  if (isMobile.value) {
    top = centerY - (yiyuHeight * 3) / 4;
  } else top = centerY - yiyuHeight / 2;

  yiyu.setPosition(`${top}px`, `${centerX - yiyuWeight / 2}px`);
};

const handleRecordComplete = (blob) => {
  isAudio2Text.value = true;

  const audioFile = new File([blob], 'audio.wav', {
    type: 'audio/wav',
  });

  const formData = new FormData();
  formData.append('audio', audioFile);

  files_service.audio
    .toText(formData)
    .then((res) => {
      if (res.code === '200') {
        text.value = res.data;
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('识别失败');
    })
    .finally(() => {
      isAudio2Text.value = false;
    });
};

// 保证 yiyu 已经被初始化
watchEffect(async () => {
  if (yiyuStore.isSuccess) {
    loading.value = false;

    await nextTick(); // 等待 DOM 更新完成， 才能正确更新位置。

    updateAvatarPosition();
    yiyu.enableYiyuApp();

    if (isMobile.value) yiyu.setAvatarSize(5);

    if (!canTextTranslate.value) yiyu.disableTextSelection();
  }
});

onMounted(() => {
  let size;
  if (isMobile.value) size = 5;
  else size = 1;

  yiyu.setAvatarSize(size);
});

onUnmounted(() => {
  if (yiyuStore.isSuccess) {
    yiyu.setAvatarSize(3);
  }
});

// 监听窗口变化，动态调整位置
watch([winWidth, winHeight], () => {
  updateAvatarPosition();
});
</script>

<style scoped>
.body {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 600px 600px;
  gap: 1.875rem;
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

:deep(.el-loading-text) {
  /* color: #66c18c; */
}
</style>
