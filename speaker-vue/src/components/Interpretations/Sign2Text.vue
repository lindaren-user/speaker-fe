<template>
  <el-card class="lCard">
    <template #header>
      <span v-if="usedModelStore.usedModel"
        >当前使用模型为 "{{ usedModelStore.usedModel.name }}"</span
      >
      <span v-else>没有选择模型</span>
    </template>
    <ControlPanel
      @add-video="handleAddVideo"
      @start-recording="showCameraDialog = true"
      @upload-all="uploadVideo"
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
      <div>
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
</template>

<script setup>
import { ref } from 'vue';
import { useUsedModelStore } from '@/stores/usedModel';
import ControlPanel from '@/components/Others/ControlPanel.vue';
import CameraRecorder from '@/components/Recorders/CameraRecorder.vue';
import formRequest from '@/utils/formRequest';

const requestLocal = '/api';

const video = ref(null);
const showCameraDialog = ref(false);
const nextVideoId = ref(1);
const previewVideoUrl = ref('');
const videoUrl = ref('');
const isTranslating = ref(false);
const resultText = ref('');
const usedModelStore = useUsedModelStore();

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
  previewVideoUrl.value = '';
  // 释放之前创建的ObjectURL
  //   if (video.value && video.value.file) {
  //     URL.revokeObjectURL(URL.createObjectURL(video.value.file));
  //   }
};

// 单个视频上传方法
const uploadVideo = () => {
  if (!video.value) {
    ElMessage.warning('请先选择视频');
    return;
  }

  isTranslating.value = true;

  const formData = new FormData();
  formData.append('video', video.value.file);
  formData.append('videoId', video.value.id);

  formRequest
    .post('/api/infer', formData)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          showClose: true,
          type: 'success',
          message: `${video.value.id}上传成功`,
        });
        // 上传成功后更新展示视频的URL
        videoUrl.value = requestLocal + res.data.url;
        resultText.value = res.data.result;
        console.log(videoUrl.value);
      } else {
        ElMessage.error(`${video.value.id}上传失败`);
      }
    })
    .catch((error) => {
      console.error('上传失败:', video.value.id, error);
      ElMessage.error(`${video.value.id}上传失败`);
    })
    .finally(() => (isTranslating.value = false));
};

const handleVideoError = (error) => {
  console.error('视频播放错误:', error.target.error);
  ElMessage.error('视频播放错误');
};
</script>

<style scoped>
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
</style>
