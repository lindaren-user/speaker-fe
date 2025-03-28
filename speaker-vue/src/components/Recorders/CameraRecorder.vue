<template>
  <div class="camera-recorder">
    <video ref="videoElement" autoplay muted></video>
    <div class="controls">
      <el-button :type="isRecording && isPaused ? 'primary' : 'danger'" @click="toggleRecording">
        {{ isRecording ? (isPaused ? '继续录制' : '暂停录制') : '开始录制' }}
      </el-button>
      <el-button v-if="isRecording" type="danger" @click="stopRecording"> 停止录制 </el-button>
      <span v-if="isRecording"> &nbsp;{{ formatTime(recordingTime) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ErrorMessage } from '@/utils/messageTool';

/* 公共逻辑 */
const videoElement = ref(null);
const mediaRecorder = ref(null);
const isRecording = ref(false);
const isPaused = ref(false);
const recordingTime = ref(0);
const timer = ref(null);
const chunks = ref([]);

const emit = defineEmits(['record-complete']);

/* 函数 */
onMounted(() => initCamera());
onBeforeUnmount(() => stopCamera());

// 初始化摄像头
const initCamera = () => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.value.srcObject = stream;
      mediaRecorder.value = new MediaRecorder(stream);

      mediaRecorder.value.ondataavailable = (e) => chunks.value.push(e.data);
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: 'video/x-msvideo' });
        emit('record-complete', blob);
        chunks.value = [];
      };
    })
    .catch((err) => {
      console.error('摄像头访问失败:', err);
      ErrorMessage('无法访问摄像头');
    });
};

// 停止摄像头
const stopCamera = () => {
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  }
};

// 切换录制状态
const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording();
  } else {
    isPaused.value ? continueRecording() : pauseRecording();
  }
};

// 开始录制
const startRecording = () => {
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.start();
    isRecording.value = true;
    isPaused.value = false;
    timer.value = setInterval(() => recordingTime.value++, 1000);
  }
};

// 暂停录制
const pauseRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.pause();
    isPaused.value = true;
    clearInterval(timer.value);
  }
};

// 继续录制
const continueRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.resume();
    isPaused.value = false;
    timer.value = setInterval(() => recordingTime.value++, 1000);
  }
};

// 停止录制
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    clearInterval(timer.value);
    isRecording.value = false;
    isPaused.value = false;
    recordingTime.value = 0;
  }
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.camera-recorder {
  position: relative;
}

.camera-recorder video {
  width: 100%;
  max-height: 26.25rem;
  background: #000;
  border-radius: 0.5rem;
}

.controls {
  margin-top: 0.9375rem;
  text-align: center;
}
</style>
