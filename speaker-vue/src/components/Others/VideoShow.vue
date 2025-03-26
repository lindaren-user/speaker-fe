<template>
  <div class="Show-head">
    <span style="font-size: 20px" v-if="showObject">{{ showObject.title }}</span>
    <el-button type="primary" @click="addTag">{{ showObject.tag ? '更改' : '新增' }}注解</el-button>
  </div>

  <el-divider style="margin: 5% auto" />

  <div class="video-show">
    <video v-if="videoUrl" :src="videoUrl" controls class="video-player" @error="handleVideoError">
      您的浏览器不支持视频播放
    </video>
    <div v-else class="video-placeholder">
      <el-empty description="没有选择视频" />
    </div>
  </div>
</template>

<script setup>
import emittr from '@/utils/event-bus';
import { ErrorMessage, WarningMessage } from '@/utils/messageTool';

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

// 处理视频加载错误
const handleVideoError = () => {
  ErrorMessage('视频加载失败');
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
