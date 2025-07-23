<template>
  <div class="canvas-recorder">
    <canvas id="canvas" ref="canvas"></canvas>
    <div class="loading" v-loading="!isSuccessful"></div>
    <div class="controls">
      <el-button
        :type="isRecording && isPaused ? 'primary' : 'danger'"
        @click="toggleRecording"
        :disabled="!isSuccessful"
      >
        {{ isRecording ? (isPaused ? '继续录制' : '暂停录制') : '开始录制' }}
      </el-button>
      <el-button v-if="isRecording" type="danger" @click="stopRecording"> 停止录制 </el-button>
      <span v-if="isRecording"> &nbsp;{{ formatTime(recordingTime) }} </span>
    </div>
  </div>
</template>

<script setup>
import { ErrorMessage } from '@/utils/others/messageTool';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import fixWebmDuration from 'fix-webm-duration';

const router = useRouter();

const canvas = ref(null);
const ctx = ref(null); // 画笔

const isRecording = ref(false);
const isPaused = ref(false);
const recordingTime = ref(0);
const timer = ref(null);
const recorder = ref(null);
const chunks = ref([]);

const emit = defineEmits(['record-complete']);

let ws = null;

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');

  // 根据后端推送图像尺寸调整
  canvas.value.width = 640;
  canvas.value.height = 440;
});

// 是否成功连接 ws
const isSuccessful = ref(false);

// 帧队列
// const frameQueue = [];
let curFrame = null;

// 是否因为 err 断开 ws
// let closeByErr = false;

// 防抖
function debounce(fn, delay = 1000) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer); // 如果已有定时器，清除它

    // 创建一个新的定时器，在 delay 毫秒后执行 fn
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const props = defineProps({
  isOpened: {
    type: Boolean,
    default: false,
  },
});

const initWS = () => {
  if (!props.isOpened) return;

  console.log(props.isOpened);

  console.log('initWS');

  if (curFrame) URL.revokeObjectURL(curFrame.src);

  const JSESSIONID = parseCookies().JSESSIONID;
  console.log(JSESSIONID);

  if (JSESSIONID)
    ws = new WebSocket(`ws://${location.host}/api/ws/video` + `?JSESSIONID=${JSESSIONID}`);
  else {
    ErrorMessage('您还未登录');
    router.push('/login');
  }

  ws.onopen = () => {
    console.log('ws成功连接');

    isSuccessful.value = true;
    // closeByErr = false;

    startRendering();
  };

  ws.onmessage = (event) => {
    console.log('接收到', event.data);

    if (event.data) {
      const blob = new Blob([event.data], { type: 'image/jpg' });

      const frame = new Image();
      frame.onload = () => {
        // frameQueue.push(frame);
        curFrame = frame;
      };
      frame.src = URL.createObjectURL(blob);
    } else {
      console.error('格式不对');
    }
  };

  ws.onerror = (err) => {
    isSuccessful.value = false;
    // closeByErr = true;

    console.error(err);
  };

  ws.onclose = () => {
    console.log('ws连接关闭');

    isSuccessful.value = false;

    // 清空计时器
    if (renderInterval) {
      clearInterval(renderInterval);
      renderInterval = null;
    }

    // 清空帧队列
    // frameQueue.length = 0;
    curFrame = '';

    if (props.isOpened) reconnect();
  };
};

// 得到的是防抖函数的返回值，每次执行的都是返回值函数
const reconnect = debounce(() => {
  if (props.isOpened) {
    console.log('reconnect');
    initWS();
  }
}, 2000);

// 定时将帧渲染
let renderInterval = null;

const startRendering = () => {
  if (renderInterval) clearInterval(renderInterval);

  let lastFrame = '';

  renderInterval = setInterval(() => {
    // if (frameQueue.length > 0 && ctx.value) {
    //   const frame = frameQueue.shift(); // 获取队列头部
    //
    if (curFrame) {
      const frame = curFrame;
      if (lastFrame) URL.revokeObjectURL(lastFrame);

      // ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height); // 导致出现白屏
      ctx.value.drawImage(frame, 0, 0, canvas.value.width, canvas.value.height);

      lastFrame = frame.src;
    }
  }, 1000 / 15);
};

// 获取 cookie
const parseCookies = () => {
  const cookies = {};
  document.cookie.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=');
    cookies[key] = value;
  });
  return cookies;
};

const closeWS = () => {
  if (ws) {
    console.log('closeWS');

    ws.close();
    ws = null;
  }
};

defineExpose({ initWS, closeWS });

const startRecording = () => {
  if (!isSuccessful.value) return;

  // 录制 canvas 实时渲染的视频
  const stream = canvas.value.captureStream(30);

  // MediaRecorder 录制的 webm 文件在录制结束时没有正确写入 duration 元数据，导致大多数浏览器无法识别总时长
  recorder.value = new MediaRecorder(stream, { mimeType: 'video/webm' });

  chunks.value = [];
  recorder.value.ondataavailable = (e) => chunks.value.push(e.data);
  recorder.value.onstop = async () => {
    const blob = new Blob(chunks.value, { type: 'video/webm' });
    const fixedBlob = await fixWebmDuration(blob, recordingTime.value * 1000);
    emit('record-complete', fixedBlob, 'webm');
    chunks.value = [];
  };

  recorder.value.start();

  isRecording.value = true;
  isPaused.value = false;

  // 录制时长计时器
  timer.value = setInterval(() => recordingTime.value++, 1000);
};

const pauseRecording = () => {
  recorder.value?.pause();
  isPaused.value = true;
  clearInterval(timer.value);
};

const continueRecording = () => {
  recorder.value?.resume();
  isPaused.value = false;
  timer.value = setInterval(() => recordingTime.value++, 1000);
};

const stopRecording = () => {
  recorder.value?.stop();

  isRecording.value = false;
  isPaused.value = false;
  recordingTime.value = 0;

  clearInterval(timer.value);
};

const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording();
  } else {
    isPaused.value ? continueRecording() : pauseRecording();
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped lang="scss">
.canvas-recorder {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  canvas {
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background: #fff;
    width: 90%;
    height: 440px;
    position: relative;
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 48%;
    transform: translate(-50%, -50%);
  }

  .controls {
    margin-top: 1rem;
  }
}
</style>
