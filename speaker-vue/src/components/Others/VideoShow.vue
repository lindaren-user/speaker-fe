<template>
  <div v-if="isMobile">
    <van-popup
      v-model:show="openVideo"
      position="bottom"
      style="height: 60vh"
      closeable
      :close-on-click-overlay="false"
      @close="clearVideoData"
    >
      <van-divider
        ><span style="color: black; font-size: large">{{ showObject.title }}</span></van-divider
      >
      <video v-if="videoUrl" :src="videoUrl" controls style="width: 100%" @error="handleVideoError">
        您的浏览器不支持视频播放
      </video>
      <div>标注：{{ showObject.tag === true ? showObject.number : '暂无' }}</div>
    </van-popup>
  </div>

  <div v-else>
    <div class="Show-head">
      <span style="font-size: 20px" v-if="showObject">{{ showObject.title }}</span>
      <el-button type="primary" @click="addTag"
        >{{ showObject?.tag ? '更改' : '新增' }}注解</el-button
      >
    </div>

    <el-divider style="margin: 5% auto" />

    <div class="video-show">
      <video
        v-if="videoUrl"
        :src="videoUrl"
        controls
        class="video-player"
        @error="handleVideoError"
      >
        您的浏览器不支持视频播放
      </video>
      <div v-else class="video-placeholder">
        <el-empty description="没有选择视频" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ErrorMessage, WarningMessage } from '@/utils/messageTool';
import { _isMobile } from '@/utils/isMobile';
import emittr from '@/utils/event-bus';

/* 公共变量 */
const props = defineProps({
  videoUrl: {
    type: String,
    default: null,
  },

  showObject: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:videoUrl']);

/* 移动端 */
const isMobile = computed(() => _isMobile());
const openVideo = ref(false);
watchEffect(() => {
  openVideo.value = props.videoUrl !== null && props.videoUrl !== '';
});

/* 函数 */
const clearVideoData = () => {
  if (props.videoUrl.value) {
    URL.revokeObjectURL(props.videoUrl.value);
  }
};

// 处理视频加载错误
const handleVideoError = (error) => {
  switch (error.target.error.code) {
    case error.target.error.MEDIA_ERR_ABORTED:
      ErrorMessage('视频加载被中止');
      break;
    case error.target.error.MEDIA_ERR_NETWORK:
      ErrorMessage('网络错误，无法加载视频');
      break;
    case error.target.error.MEDIA_ERR_DECODE:
      ErrorMessage('视频解码错误，可能是格式不支持');
      break;
    case error.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      ErrorMessage('视频格式不支持');
      break;
    default:
      ErrorMessage('未知错误');
  }
  emit('update:videoUrl', null);
};

// 触发新增注解事件
const addTag = () => {
  if (!props.videoUrl) {
    WarningMessage('请先选择视频');
    return;
  }
  emittr.emit('add');
};
</script>

<style scoped>
.Showbody {
  height: 75vh !important;
  width: 55%;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
  margin-right: 0.625rem;
}

.Show-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  border-radius: 0.1875rem;
  width: 100%;
}

.video-show {
  width: 100%;
  flex: 9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-placeholder {
  margin: 10% auto;
  color: #666;
}
</style>
