<template>
  <div v-if="isMobile">
    <van-list
      v-if="videos.length !== 0"
      finished-text="没有更多了"
      style="margin-top: 1vh; border-top: 1px dotted lightgray"
    >
      <van-swipe-cell
        v-for="video in videos"
        :key="video.id"
        style="border-bottom: 1px solid lightgray"
      >
        <van-cell
          :border="false"
          icon="video-o"
          :title="video.id"
          :value="video.isUploaded ? '已上传' : ''"
          @click="showVideoPreview(video.id)"
        />
        <template #right>
          <van-button
            style="height: 100%"
            square
            type="danger"
            text="删除"
            @click="emit('delete-video', video.id)"
          />
        </template>
      </van-swipe-cell>
    </van-list>

    <van-empty v-else description="暂无视频" />

    <van-popup
      v-model:show="showPreviewDialog"
      position="bottom"
      style="height: auto"
      closeable
      :close-on-click-overlay="false"
    >
      <van-divider><span style="color: black; font-size: large">视频预览</span></van-divider>
      <div class="videoCenter">
        <video
          v-if="previewVideoUrl"
          :src="previewVideoUrl"
          controls
          style="height: 100%"
          @error="handleVideoError"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
      <div style="width: 100%; padding: 5px"></div>
    </van-popup>
  </div>

  <div v-else class="main">
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
            <button class="dltBtn" @click.stop="emit('delete-video', video.id)">
              <i class="iconfont icon-shanchu1" style="color: red; font-size: 1.75rem"></i>
            </button>
          </div>

          <!-- 上传成功标记 -->
          <el-icon v-if="video.isUploaded"><CircleCheck /></el-icon>
        </div>
      </div>

      <!-- 视频预览模态框 -->
      <el-dialog
        style="height: 550px"
        v-model="showPreviewDialog"
        title="视频预览"
        :close-on-click-modal="false"
        @close="closeDlg"
      >
        <div style="height: 440px">
          <video
            style="height: 100%"
            :src="previewVideoUrl"
            controls
            class="video-player"
            preload="auto"
            @error="handleVideoError"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </el-dialog>
    </div>

    <el-empty v-if="videos.length === 0" description="暂无视频" style="padding: 0" />
  </div>
</template>

<script setup>
import { _isMobile } from '@/utils/mobile/isMobile';
import { handleVideoErrorFunc } from '@/utils/others/handleVideoError';

/* 公共变量 */
const props = defineProps({
  videos: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(['delete-video']);

const showPreviewDialog = ref(false);
const previewVideoUrl = ref('');

/* 移动端 */
const isMobile = computed(() => _isMobile());

/* pc端 */
const hoverId = ref(null);

/* 函数 */
// 显示视频预览
const showVideoPreview = (videoId) => {
  const video = props.videos.find((v) => v.id === videoId);
  if (video) {
    if (video.file) previewVideoUrl.value = URL.createObjectURL(video.file);
    showPreviewDialog.value = true;
  }
};

// 关闭预览弹窗
const closeDlg = () => {
  showPreviewDialog.value = false;
  if (previewVideoUrl.value) URL.revokeObjectURL(previewVideoUrl.value);
};

const handleVideoError = (error) => {
  handleVideoErrorFunc(error);
};
</script>

<style scoped lang="scss">
.main {
  overflow: auto;
  height: 18.75rem;

  scrollbar-width: thin;
  scrollbar-color: #999 #f0f0f0;

  :deep(::-webkit-scrollbar) {
    width: 5px;
    height: 5px;
  }

  :deep(::-webkit-scrollbar-track) {
    background: #f0f0f0;
  }

  :deep(::-webkit-scrollbar-thumb) {
    background: #999;
    border-radius: 4px;
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.25rem;
  margin-top: 0.9375rem;
}

.video-item {
  position: relative;
  border: 0.0625rem solid #ebeef5;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.video-item:hover {
  transform: translateY(-0.3125rem);
}

.thumbnail {
  position: relative;
  height: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.dltBtn {
  border-radius: 50%;
  border-width: 0.0625rem;
  border-color: red;
  width: 3.125rem;
  height: 3.125rem;
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

.icon-shipin {
  font-size: 2.5rem;
  color: #409eff;
}

.video-id {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.video-player {
  width: 100%;
  height: auto;
}
</style>
