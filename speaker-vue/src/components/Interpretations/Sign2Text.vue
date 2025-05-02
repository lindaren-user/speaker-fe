<template>
  <div v-if="isMobile">
    <van-notice-bar
      :color="hasModel ? '#1989fa' : ''"
      :background="hasModel ? '#ecf9ff' : ''"
      left-icon="info-o"
      mode="link"
      @click="router.push('/implents/models')"
      style="margin-top: 1vh"
    >
      <span v-if="hasModel">已选择模型</span>
      <span v-else>没有选择模型，点击选择</span>
    </van-notice-bar>

    <ControlPanel @add-video="handleAddVideo" @upload="uploadVideo" />
    <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
      <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
    </el-dialog>

    <div class="sign">
      <van-swipe-cell v-if="video">
        <van-cell icon="video-o" :border="false" :title="video.id" @click="openVideo = true" />
        <template #right>
          <van-button
            style="height: 100%"
            square
            type="danger"
            text="删除"
            @click="handleDeleteVideo"
          />
        </template>
      </van-swipe-cell>
      <div v-else class="noSign">! 没有选择视频</div>
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
        <span v-else>
          <span v-if="isTranslating">转换中，请稍后...</span>
          <span v-else>无转换</span>
        </span>
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

  <div v-else class="body">
    <el-card class="lCard">
      <template #header>
        <div class="header">
          <span v-if="hasModel">已选择模型</span>
          <span v-else>没有选择模型</span>
          <el-button
            type="primary"
            :class="canBlink && !hasModel ? 'blink-btn' : ''"
            @click="router.push('/implents/models/myModels')"
            >{{ hasModel ? '重新选择' : '前往选择' }}</el-button
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
          style="height: 100%"
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
        <div v-else>
          <el-empty description="暂无结果" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useUsedModelStore } from '@/stores/usedModel';
import { files_service } from '@/apis/files_service';
import { _isMobile } from '@/utils/mobile/isMobile';
import ControlPanel from '@/components/Others/ControlPanel.vue';
import CameraRecorder from '@/components/Recorders/CameraRecorder.vue';
import { handleVideoErrorFunc } from '@/utils/others/handleVideoError';
import {
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
  MessageBox,
} from '@/utils/others/messageTool';

/* 公共变量 */
const router = useRouter();

const requestLocal = '/api';
const video = ref(null);

const usedModelStore = useUsedModelStore();
const hasModel = computed(() => usedModelStore.usedModel && usedModelStore.usedModel != -1);

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

  if (!hasModel.value) {
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
  handleVideoErrorFunc(error);
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
  height: 400px;
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

.sign {
  margin-top: 3vh;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}

.noSign {
  height: 6vh;
  text-align: center;
  align-content: center;
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
