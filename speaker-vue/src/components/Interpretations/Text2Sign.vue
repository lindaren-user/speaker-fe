<template>
  <div v-if="isMobile">
    <!-- 数字人 -->
    <div style="height: 260px" ref="rCard" @click="">
      <van-loading v-show="loading" size="24px" vertical style="padding-top: 10vh"
        >数字人加载中...</van-loading
      >
    </div>

    <!-- 历史记录 -->
    <div v-if="!isInput" class="history">
      <van-divider style="margin: 1px"><span style="color: black">历史记录</span></van-divider>
      <van-empty v-if="historyTexts.length === 0" style="padding: 0" />
      <div v-else style="overflow-y: auto; height: 30vh">
        <van-swipe-cell
          v-for="(text, index) in historyTexts"
          :key="index"
          style="border-bottom: 1px solid lightgray"
        >
          <van-cell
            :border="false"
            icon="comment-o"
            :title="text"
            value="翻译"
            @click="handleSelectedText(index)"
          />
          <template #right>
            <van-button
              style="height: 100%"
              square
              type="danger"
              text="删除"
              @click="deleteHistoryText"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="inputDiv">
      <div class="inputImg" @click="changeInput">
        <img
          v-show="isRecorder"
          src="@/assets/others/keyboard.svg"
          alt=""
          style="width: 10vw; padding-top: 1vw"
        />
        <img
          v-show="!isRecorder"
          src="@/assets/others/Microphone.svg"
          alt=""
          style="width: 8vw; height: 8vw"
        />
      </div>
      <div v-if="isRecorder">
        <AudioRecorder @record-complete="handleRecordComplete" :isAudio2Text="isAudio2Text" />
      </div>
      <div v-else class="elInput">
        <el-input
          v-model="goalText"
          :rows="1"
          type="textarea"
          placeholder="请输入文本"
          :autosize="{ minRows: 1, maxRows: 1 }"
          style="width: 65vw"
          @focus="isInput = true"
          @blur="handleBlur"
        /><el-button
          type="success"
          style="width: 11vw; height: 30px; margin: auto 0"
          @click="newTranslate"
          :disabled="goalText === ''"
        >
          确定
        </el-button>
      </div>
    </div>
  </div>

  <div v-else class="body">
    <el-card class="lCard">
      <template #header> 目标文本 </template>
      <AudioRecorder @record-complete="handleRecordComplete" />
      <div class="center">
        <el-input
          v-model="goalText"
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
            :disabled="!goalText || !yiyuStore.isSuccess"
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
import { ErrorMessage, SuccessMessage } from '@/utils/others/messageTool';
import { _isMobile } from '@/utils/mobile/isMobile';
import AudioRecorder from '@/components/Recorders/AudioRecorder.vue';

/* 公共变量 */
const goalText = ref('');
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
const offsetX = 5;
const offsetY = 50;

/* 移动端 */
const isMobile = computed(() => _isMobile());
const historyTexts = ref([]);
const isRecorder = ref(false);
const isInput = ref(false);

/* pc端 */
const isCanceled = ref(false);
const dialogVisible = ref(false);

/* 函数 */
const changeInput = () => {
  isRecorder.value = !isRecorder.value;
};

const handleBlur = (event) => {
  // 失焦事件不会触发之后的点击事件，使用延时操作，先触发点击事件，后触发失焦事件
  setTimeout(() => {
    // const relatedTarget = event.relatedTarget; // 获取失去焦点后焦点的目标
    // if (relatedTarget && relatedTarget.tagName === 'BUTTON') {
    //   // console.log('焦点转移到了按钮');
    //   return;
    // }
    // // console.log('焦点未转移到按钮');
    isInput.value = false;

    // isRecorder.value = !isRecorder.value;
  }, 50);
};

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
  goalText.value = '';
};

// 调用 SDK 进行手语翻译
const startTranslation = () => {
  if (isCanceled.value) yiyu.cancelTranslation();

  yiyu.startTranslate(goalText.value);
};

// 新翻译加入历史
const newTranslate = () => {
  startTranslation();
  historyTexts.value.push(goalText.value);
};

// 处理被选中的历史文本
const handleSelectedText = (index) => {
  goalText.value = historyTexts.value[index];

  startTranslation();
};

// 删除被选中的历史文本
const deleteHistoryText = (index) => {
  historyTexts.value.splice(index, 1);
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

  yiyu.setPosition(`${top}px`, `${centerX - yiyuWeight / 2 - offsetX}px`);
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
      if (res.code === '200' && res.data !== 'No speech could be recognized.') {
        goalText.value = res.data;
        historyTexts.value.push(goalText.value);
      } else {
        // console.log(res.msg);
        // ErrorMessage(res.msg);
        ErrorMessage('识别失败');
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

watchEffect(async () => {
  // 保证 yiyu 已经被初始化
  if (yiyuStore.isSuccess) {
    loading.value = false;

    await nextTick(); // 等待 DOM 更新完成， 才能正确更新位置。

    updateAvatarPosition();
    yiyu.enableYiyuApp();

    if (isMobile.value) {
      yiyu.setAvatarSize(5);
    }

    // 获取 Yiyu 的 dom，操作其样式防止遮挡其余的 dom
    const yiyuElement = document.querySelector('.yiyuAppElement');
    if (yiyuElement) {
      yiyuElement.style.pointerEvents = 'none';
      yiyuElement.style.position = 'absolute';
      yiyuElement.style.zIndex = 1000;
    }

    if (!canTextTranslate.value) yiyu.disableTextSelection();
  }
});

onMounted(() => {
  let size = 0;
  if (isMobile.value) size = 5;
  else size = 1;

  yiyu.setAvatarSize(size);
});

onUnmounted(() => {
  if (yiyuStore.isSuccess) {
    yiyu.setAvatarSize(3);

    yiyu.setPosition(parseInt(window.innerHeight - yiyuHeight - offsetY), 0);
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

.inputDiv {
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2vh 2vw 0 2vw;
  padding-top: 1vh;
}

.isInputting {
  position: relative;
  bottom: 0;
  width: 100%;
}

.inputImg {
  height: 11vw;
  width: 11vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 50%;
}

.elInput {
  width: 80vw;
  display: flex;
  justify-content: space-between;
  padding-top: 1vh;
}

.history {
  border-top: 1px solid lightgray;
  height: 33vh;
}
</style>
