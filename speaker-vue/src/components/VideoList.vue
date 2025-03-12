<template>
  <div class="video-grid">
    <div
      v-for="video in videos"
      :key="video.id"
      class="video-item"
      @mouseenter="hoverId = video.id"
      @mouseleave="hoverId = null"
      @click="showVideoPreview(video.id)"
    >
      <div class="thumbnail">
        <i class="iconfont icon-shipin"></i>
        <span class="video-id">#{{ video.id }}</span>

        <!-- 悬浮删除按钮 -->
        <div v-if="hoverId === video.id" class="overlay">
          <button
            style="
              border-radius: 50%;
              border-width: 1px;
              border-color: red;
              width: 50px;
              height: 50px;
            "
            @click.stop="emit('delete-video', video.id)"
          >
            <i
              class="iconfont icon-shanchu1"
              style="color: red; font-size: 28px; cursor: pointer"
            ></i>
          </button>
        </div>

        <!-- 上传成功标记 -->
        <el-icon v-if="video.isUploaded"><CircleCheck /></el-icon>
      </div>
    </div>

    <!-- 视频预览模态框 -->
    <el-dialog v-model="showPreviewDialog" title="视频预览" :close-on-click-modal="false">
      <video :src="previewVideoUrl" controls class="video-player" preload="auto">
        您的浏览器不支持视频播放
      </video>
      <template #footer>
        <el-button @click="showPreviewDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>

  <el-empty v-if="videos.length === 0" description="暂无视频" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['delete-video']);

const hoverId = ref(null);
const showPreviewDialog = ref(false);
const previewVideoUrl = ref('');

const showVideoPreview = (videoId) => {
  const video = props.videos.find((v) => v.id === videoId);
  if (video) {
    previewVideoUrl.value = URL.createObjectURL(video.file);
    showPreviewDialog.value = true;
  }
};
</script>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.video-item {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.video-item:hover {
  transform: translateY(-5px);
}

.thumbnail {
  position: relative;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #67c23a;
  font-size: 18px;
}

.icon-shipin {
  font-size: 40px;
  color: #409eff;
}

.video-id {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.video-player {
  width: 100%;
  height: auto;
}
</style>
