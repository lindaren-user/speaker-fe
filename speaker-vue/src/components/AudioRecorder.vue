<template>
  <el-tooltip :content="isRecording ? '点击停止' : '语音识别'">
    <span @click="toggleRecording">
      <span v-if="isRecording" class="recording-time"> {{ formatTime(recordingTime) }}&nbsp; </span>
      <el-icon v-if="isRecording" :size="30" class="microphone blinking"><Microphone /></el-icon>
      <el-icon v-else :size="30" class="microphone"><Mute /></el-icon>
    </span>
  </el-tooltip>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isRecording = ref(false);
const recordingTime = ref(0);
const timer = ref(null);
const mediaRecorder = ref(null);
const chunks = ref([]);

const emit = defineEmits(['record-complete']);

onMounted(() => initMCP());
onBeforeUnmount(() => stopMCP());

// 切换录制状态
const toggleRecording = async () => {
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
};

// 初始化麦克风
const initMCP = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder.value = new MediaRecorder(stream);

      mediaRecorder.value.ondataavailable = (e) => {
        chunks.value.push(e.data);
      };

      mediaRecorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: 'audio/wav' });
        emit('record-complete', blob);
        chunks.value = [];
      };
    })
    .catch((err) => {
      console.error('麦克风访问失败:', err);
      ElMessage.error('无法访问麦克风');
    });
};

// 停止麦克风
const stopMCP = () => {
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  }
};

// 开始录制
const startRecording = () => {
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.start();

    isRecording.value = true;

    timer.value = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  }
};

// 停止录制
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();

    clearInterval(timer.value);

    isRecording.value = false;

    recordingTime.value = 0;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.microphone {
  cursor: pointer;
  transition: color 0.3s ease;
}

.microphone:hover {
  color: #66c18c;
}

.recording-time {
  font-size: 14px;
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
</style>
