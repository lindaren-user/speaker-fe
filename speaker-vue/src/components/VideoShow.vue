<template>
  <el-card class="Showbody">
    <template #header>
      <div class="Show-head">
        <span style="font-size: 25px" v-if="showObject !== null">{{ showObject.title }}</span>
        <el-button type="primary" @click="addTag">新增注解</el-button>
      </div>
    </template>
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
  </el-card>
</template>

<script setup>
import emittr from '@/utils/event-bus';

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
  ElMessage.error('视频加载失败');
  emit('update:videoUrl', null);
};

// 触发新增注解事件
const addTag = () => {
  if (!props.videoUrl) {
    ElMessage({
      showClose: true,
      message: '请先选择视频',
      type: 'warning',
    });
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
  border-radius: 10px;
  margin-right: 10px;
}
.Show-head {
  display: flex;
  justify-content: space-between; /* 让子元素分别靠左右两侧 */
  align-items: center; /* 垂直居中对齐 */
  flex: 1;
  border-radius: 3px;
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
