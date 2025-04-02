<template>
  <div v-if="isMobile">
    <van-popup
      v-model:show="openVideo"
      position="bottom"
      style="height: auto"
      closeable
      :close-on-click-overlay="false"
      @close="clearVideoData"
    >
      <van-divider
        ><span style="color: black; font-size: large">{{ showObject?.title }}</span></van-divider
      >
      <div class="videoCenter">
        <video
          v-if="videoUrl"
          :src="videoUrl"
          controls
          style="height: 100%"
          @error="handleVideoError"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="videoTag">标注：{{ showObject?.tag === true ? showObject.number : '暂无' }}</div>
    </van-popup>
  </div>

  <div v-else>
    <div class="Show-head">
      <span style="font-size: 20px" v-if="showObject">{{ showObject?.title }}</span>
      <el-button type="primary" @click="addTag"
        >{{ showObject?.tag ? '更改' : '新增' }}注解</el-button
      >
    </div>

    <el-divider style="margin: 5% auto" />

    <div class="video-show">
      <video
        style="height: 75%"
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
import { WarningMessage } from '@/utils/others/messageTool';
import { _isMobile } from '@/utils/mobile/isMobile';
import { handleVideoErrorFunc } from '@/utils/others/handleVideoError';

/* 公共变量 */
const props = defineProps({
  videoUrl: {
    type: String,
    default: '',
  },

  showObject: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['update:videoUrl', 'addTag']);

/* 移动端 */
const isMobile = computed(() => _isMobile());
const openVideo = ref(false);
watchEffect(() => {
  openVideo.value = props.videoUrl !== '';
});

/* 函数 */
const clearVideoData = () => {
  if (props.videoUrl) {
    URL.revokeObjectURL(props.videoUrl);
    if (isMobile.value) emit('update:videoUrl', '');
  }
};

// 处理视频加载错误
const handleVideoError = (error) => {
  handleVideoErrorFunc(error);
  emit('update:videoUrl', '');
};

// 触发新增注解事件
const addTag = () => {
  if (!props.videoUrl) {
    WarningMessage('请先选择视频');
    return;
  }
  emit('addTag');
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
  height: 440px;
  display: flex;
  justify-content: center;
}

.video-player {
  height: 100%;
}

.video-placeholder {
  margin: 10% auto;
  color: #666;
}

.videoTag {
  width: 100%;
  text-align: center;
  padding: 5px;
}
</style>
