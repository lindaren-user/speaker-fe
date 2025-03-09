<template>
  <div class="camera-recorder" >
    <video ref="videoPreview" autoplay muted></video>
    <div class="controls">
      <el-button
        :type="isRecording ? 'danger' : 'primary'"
        @click="toggleRecording"
      >
        {{ isRecording ? (isPaused ? '继续录制' : '暂停录制') : '开始录制' }}
      </el-button>
      <el-button
        v-if="isRecording"
        type="danger"
        @click="stopRecording"
      >
        停止录制
      </el-button>
      {{ formatTime(recordingTime) }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

// 定义 ref
const videoPreview = ref(null);

// 定义响应式数据
const mediaRecorder = ref(null);
const isRecording = ref(false);
const isPaused = ref(false);
const recordingTime = ref(0);
const timer = ref(null);
const chunks = ref([]);

const emit = defineEmits(['record-complete']);

onMounted(() => {
  initCamera();
});

onBeforeUnmount(() => {
  stopCamera();
});

// 初始化摄像头
const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoPreview.value.srcObject = stream;
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (e) => {
      chunks.value.push(e.data);
    };

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(chunks.value, { type: 'video/x-msvideo' });
      emit('record-complete', blob);
      chunks.value = [];
    };
  } catch (error) {
    console.error('摄像头访问失败:', error);
    ElMessage.error('无法访问摄像头');
  }
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
    if (isPaused.value) {
      continueRecording();
    } else {
      pauseRecording();
    }
  }
};

// 开始录制
const startRecording = () => {
  mediaRecorder.value.start();
  isRecording.value = true;
  isPaused.value = false;
  timer.value = setInterval(() => {
    recordingTime.value++;
  }, 1000);
};

// 暂停录制
const pauseRecording = () => {
  mediaRecorder.value.pause();
  isPaused.value = true;
  clearInterval(timer.value);
};

// 继续录制
const continueRecording = () => {
  mediaRecorder.value.resume();
  isPaused.value = false;
  timer.value = setInterval(() => {
    recordingTime.value++;
  }, 1000);
};

// 停止录制
const stopRecording = () => {
  mediaRecorder.value.stop();
  clearInterval(timer.value);
  isRecording.value = false;
  isPaused.value = false;
  recordingTime.value = 0;
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
  max-height: 420px;
  background: #000;
  border-radius: 8px;
}

.controls {
  margin-top: 15px;
  text-align: center;
}
</style>