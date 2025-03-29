<template>
  <div v-if="isMobile">
    <van-notice-bar
      :color="hasModels ? '#1989fa' : ''"
      :background="hasModels ? '#ecf9ff' : ''"
      left-icon="info-o"
      mode="link"
      @click="router.push('/implents/models')"
      style="margin-top: 1vh"
    >
      <span v-if="hasModels">已选择{{ usedModelStore.usedModel.length }}个模型</span>
      <span v-else>没有选择模型</span>
    </van-notice-bar>

    <ControlPanel @add-video="handleAddVideo" @upload="uploadVideo" />
    <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
      <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
    </el-dialog>

    <div
      style="margin-top: 3vh; border-top: 1px solid lightgray; border-bottom: 1px solid lightgray"
    >
      <van-swipe-cell v-if="video">
        <van-cell icon="video-o" :border="false" :title="video.id" @click="openVideo = true" />
        <template #right>
          <van-button square type="danger" text="删除" @click="handleDeleteVideo" />
        </template>
      </van-swipe-cell>
      <div v-else style="height: 44px; text-align: center; align-content: center">
        ! 没有选择视频
      </div>
    </div>

    <div style="height: 40vh; margin-top: 5vh">
      <van-notice-bar
        :color="videoUrl ? '#1989fa' : ''"
        :background="videoUrl ? '#ecf9ff' : ''"
        left-icon="info-o"
        :mode="videoUrl ? 'link' : ''"
        @click="getResultText"
        style="margin-top: 1vh"
      >
        <span v-if="videoUrl">查看转换结果</span>
        <span v-else>无转换</span>
      </van-notice-bar>
      <video v-if="videoUrl" :src="videoUrl" controls style="width: 100%" @error="handleVideoError">
        您的浏览器不支持视频播放
      </video>
      <van-empty v-else description="未转换" style="height: 33vh" />
    </div>

    <van-popup
      v-model:show="openResult"
      position="bottom"
      style="height: 40vh"
      closeable
      :close-on-click-overlay="false"
    >
      <van-divider><span style="color: black; font-size: large">转化结果</span></van-divider>

      {{ resultText }}
    </van-popup>

    <van-popup
      v-model:show="openVideo"
      position="bottom"
      style="height: 35vh"
      closeable
      :close-on-click-overlay="false"
    >
      <video
        v-if="previewVideoUrl"
        :src="previewVideoUrl"
        controls
        style="width: 100%"
        @error="handleVideoError"
      >
        您的浏览器不支持视频播放
      </video>
    </van-popup>
  </div>

  <div v-else class="body">
    <el-card class="lCard">
      <template #header>
        <div class="header">
          <span v-if="hasModels">已选择{{ usedModelStore.usedModel.length }}个模型</span>
          <span v-else>没有选择模型</span>
          <el-button
            type="primary"
            :class="canBlink && !hasModels ? 'blink-btn' : ''"
            @click="router.push('/implents/models/myModels')"
            >{{ hasModels ? '重新选择' : '前往选择' }}</el-button
          >
        </div>
      </template>
      <ControlPanel
        @add-video="handleAddVideo"
        @start-recording="showCameraDialog = true"
        @upload="uploadVideo"
      />

      <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
        <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
      </el-dialog>

      <div class="video-show">
        <video
          v-if="previewVideoUrl"
          :src="previewVideoUrl"
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

      <div class="btnCenter">
        <el-button
          v-if="previewVideoUrl"
          type="danger"
          @click="handleDeleteVideo"
          style="margin: 20px auto"
          >删除</el-button
        >
      </div>
    </el-card>

    <el-card class="rCard">
      <template #header>
        <div style="height: 30px">
          <span v-if="isTranslating">转换中...</span>
          <span v-else>转换结果</span>
        </div>
      </template>
      <div class="video-show">
        <div style="height: 1.875rem">{{ resultText }}</div>
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
          <el-empty description="暂无结果" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useUsedModelStore } from '@/stores/usedModel';
import { files_service } from '@/apis/files_service';
import { ErrorMessage, SuccessMessage, WarningMessage, MessageBox } from '@/utils/messageTool';
import { _isMobile } from '@/utils/isMobile';
import ControlPanel from '@/components/Others/ControlPanel.vue';
import CameraRecorder from '@/components/Recorders/CameraRecorder.vue';

/* 公共变量 */
const router = useRouter();

const requestLocal = '/api';
const video = ref(null);

const usedModelStore = useUsedModelStore();
const hasModels = computed(() => usedModelStore.usedModel && usedModelStore.usedModel.length !== 0);

const previewVideoUrl = ref('');
const videoUrl = ref('');

const isTranslating = ref(false);
const resultText = ref('');

const nextVideoId = ref(1);

/* 移动端 */
const isMobile = computed(() => _isMobile());
const openVideo = ref(false);
const openResult = ref(false);

/* pc端 */
const canBlink = ref(false);
const showCameraDialog = ref(false);

/* 函数 */
const handleAddVideo = (file) => {
  video.value = {
    id: `video_${new Date().getTime()}${nextVideoId.value++}`,
    file,
    isUploaded: false,
    type: 'file',
    timeStamp: new Date(),
  };
  // 更新预览视频的URL
  previewVideoUrl.value = URL.createObjectURL(file);
};

const handleRecordComplete = (blob) => {
  const timeStamp = Date.now();
  const aviFile = new File([blob], `${timeStamp}.avi`, {
    type: 'video/x-msvideo',
  });
  handleAddVideo(aviFile);
  showCameraDialog.value = false;
};

const handleDeleteVideo = () => {
  MessageBox('视频').then(() => {
    URL.revokeObjectURL(previewVideoUrl.value);
    previewVideoUrl.value = '';
    video.value = null;
  });
};

// 单个视频上传方法
const uploadVideo = () => {
  if (!video.value) {
    WarningMessage('请先选择视频');
    return;
  }

  if (!hasModels.value) {
    WarningMessage('未选择模型');

    canBlink.value = true;

    setTimeout(() => {
      canBlink.value = false;
    }, 2000);

    return;
  }

  isTranslating.value = true;

  const formData = new FormData();
  formData.append('video', video.value.file);
  formData.append('models', usedModelStore.usedModel);

  files_service.video
    .uploadVideo(formData)
    .then((res) => {
      if (res.code === '200') {
        SuccessMessage('上传成功');
        // 上传成功后更新展示视频的URL
        videoUrl.value = requestLocal + res.data.url;
        resultText.value = res.data.result;
        console.log(videoUrl.value);
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((error) => {
      console.error('上传失败:', video.value.id, error);
      ErrorMessage('上传失败');
    })
    .finally(() => (isTranslating.value = false));
};

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
};

const getResultText = () => {
  if (videoUrl.value) openResult.value = true;
};
</script>

<style scoped>
.body {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 600px 600px;
  gap: 1.875rem;
}

.header {
  display: flex;
  justify-content: space-between;
  height: 30px;
}

.lCard {
  height: 40.625rem !important;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
}

.rCard {
  height: 40.625rem !important;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;
}

.video-player {
  width: 100%;
  height: auto;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.video-system {
  margin-top: 1.875rem;
  border: 1px solid #ebeef5;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.video-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-show {
  margin-top: 5vh;
  border-radius: 0.3125rem;
}

.video-show2 {
  border-radius: 0.3125rem;
  border: 0.0625rem solid black;
}

.btnCenter {
  display: flex;
}

.el-main {
  border: 0.0625rem solid black;
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

.blink-btn {
  animation: blink 1s infinite;
}
</style>
