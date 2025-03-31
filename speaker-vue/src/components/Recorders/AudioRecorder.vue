<template>
  <div v-if="isMobile" class="mobile-audio-recorder">
    <div
      @touchstart="startRecording"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      class="recorderBtn"
    >
      <span
        ><el-icon v-if="!isRecording"><Microphone /></el-icon>
        {{ props.isAudio2Text ? '识别中...' : isRecording ? '录音中' : '按住说话' }}</span
      >
    </div>
    <div v-if="isRecording" class="recording-overlay">
      <div ref="crossBtn">
        <el-button type="danger" size="large" class="crossBtn"><van-icon name="cross" /></el-button>
      </div>
      <div :class="{ willBeCanceled: beCanceled, noCanceled: !beCanceled }" class="bottomTip">
        <div class="tipText">
          <div style="text-align: center">
            <el-icon class="blinking"><Microphone /></el-icon>
            <span class="recording-time">{{ formatTime(recordingTime) }}</span>
          </div>
          <div>
            {{ beCanceled ? '松开取消识别' : '正在录音，松开后识别' }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="audioRecorder">
    <el-tooltip :content="isRecording ? '点击停止' : '点击开始'">
      <span @click="toggleRecording">
        <el-icon v-if="isRecording" :size="30" class="microphone blinking"><Microphone /></el-icon>
        <el-icon v-else :size="30" class="microphone"><Mute /></el-icon>
        <span v-if="isRecording" class="recording-time">{{ formatTime(recordingTime) }}</span>
      </span>
    </el-tooltip>
    <span>
      <el-button type="primary" @click="translateToText" :disabled="!isFinished">识别</el-button>
      <el-button type="danger" @click="clearAudio" :disabled="!isFinished">清除</el-button>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineEmits, useTemplateRef } from 'vue';
import { ErrorMessage } from '@/utils/messageTool';
import { _isMobile } from '@/utils/isMobile';
import { useElementBounding } from '@vueuse/core';

/* 公共逻辑 */
const isRecording = ref(false);
const recordingTime = ref(0);
const timer = ref(null);
const mediaRecorder = ref(null);
const chunks = ref([]);
const isFinished = ref(false);
const canUse = ref(false);

let blob = null;

const emit = defineEmits(['record-complete']);

/* 移动端 */
const isMobile = computed(() => _isMobile());
const beCanceled = ref(false);
const crossBtn = useTemplateRef('crossBtn');
const { top, right, bottom, left } = useElementBounding(crossBtn);

const props = defineProps({
  isAudio2Text: {
    type: Boolean,
    default: false,
  },
});

/* 函数 */
onMounted(() => initMicrophone());
onBeforeUnmount(() => stopMicrophone());

// 初始化麦克风
const initMicrophone = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder.value = new MediaRecorder(stream);
      mediaRecorder.value.ondataavailable = (e) => chunks.value.push(e.data);
      mediaRecorder.value.onstop = () => {
        blob = new Blob(chunks.value, { type: 'audio/wav' });
      };
      canUse.value = true;
    })
    .catch((err) => {
      if (err.name === 'NotAllowedError') {
        console.error('用户拒绝了权限请求');
        ErrorMessage('用户拒绝了权限请求');
      } else if (err.name === 'NotFoundError') {
        console.error('未找到麦克风');
        ErrorMessage('未找到麦克风');
      } else {
        console.error('无法访问麦克风:', err.message);
        ErrorMessage('无法访问麦克风:', err.message);
      }
    });
};

// 停止麦克风
const stopMicrophone = () => {
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  }
};

// 开始录制
const startRecording = () => {
  if (!canUse.value) initMicrophone();

  if (isMobile.value && props.isAudio2Text) return;

  mediaRecorder.value.start();

  isRecording.value = true;
  isFinished.value = false;
  beCanceled.value = false;
  timer.value = setInterval(() => recordingTime.value++, 1000);
};

// 停止录制
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    clearInterval(timer.value);
    isRecording.value = false;
    isFinished.value = true;
  }
};

// 切换录制状态（PC 端）
const toggleRecording = () => {
  isRecording.value ? stopRecording() : startRecording();
};

// 清除录音数据
const clearAudio = () => {
  chunks.value = [];
  blob = null;
  recordingTime.value = 0;
  isFinished.value = false;
};

// 开始转换
const translateToText = () => {
  if (recordingTime.value < 1) ErrorMessage('说话时间太短');
  else emit('record-complete', blob);

  clearAudio();
};

// 取消识别
const cancelAudio = () => {
  if (isRecording.value) {
    stopRecording();
    clearAudio();
  }
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 判断点是否在元素区域内
const isPointInElement = (pointX, pointY) => {
  return (
    pointX >= left.value && pointX <= right.value && pointY >= top.value && pointY <= bottom.value
  );
};

// 处理触摸移动事件
const handleTouchMove = (event) => {
  if (isRecording.value) {
    const touch = event.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    if (isPointInElement(touchX, touchY)) {
      beCanceled.value = true;
    } else beCanceled.value = false;
  }
};

// 处理触摸结束事件
const handleTouchEnd = (event) => {
  if (isRecording.value) {
    const touch = event.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    if (isPointInElement(touchX, touchY)) cancelAudio();
    else {
      stopRecording();
      translateToText();
    }
  }
};
</script>

<style scoped>
.recording-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.noCanceled {
  background-color: lightgray;
}

.willBeCanceled {
  background-color: rgb(226, 132, 132);
}

.audioRecorder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9375rem 0;
}

.microphone {
  cursor: pointer;
  transition: color 0.3s ease;
}

.microphone:hover {
  color: #66c18c;
}

.recording-time {
  font-size: 0.875rem;
  color: #666;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.blinking {
  animation: blink 1s infinite;
}

.mobile-audio-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.recording-time {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #666;
}

.recorderBtn {
  border: 1px solid lightgray;
  height: 4vh;
  width: 80vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottomTip {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 1000;
  border-radius: 50% 50% 0 0;
}

.tipText {
  position: absolute;
  bottom: 10%;
  width: 100%;
  height: 50%;
  display: grid;
  justify-content: center;
}

.crossBtn {
  border-radius: 50%;
  width: 20vw;
  height: 20vw;
}
</style>
