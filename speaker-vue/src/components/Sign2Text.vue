<template>
  <el-card class="lCard" style="width: 35vw">
    <ControlPanel
      @add-video="handleAddVideo"
      @start-recording="showCameraDialog = true"
      @upload-all="uploadVideo"
    />

    <!-- 摄像头录制对话框 -->
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

  <el-card class="rCard" style="width: 45vw">
    <template #header>
      <div class="card-header">
        <span v-if="isTranslating">转换中...</span>
        <span v-else>转换结果 </span>
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
        <el-empty description="暂无结果" />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import ControlPanel from '@/components/ControlPanel.vue';
import CameraRecorder from '@/components/CameraRecorder.vue';
import formRequest from '@/utils/formRequest';
import { ElMessage } from 'element-plus';

const video = ref(null);
const showCameraDialog = ref(false);
const nextVideoId = ref(1);
const previewVideoUrl = ref('');
const videoUrl = ref('');
const isTranslating = ref(false);

const handleAddVideo = (file) => {
  video.value = {
    id: `video_${new Date().getTime()}${nextVideoId.value++}`,
    file,
    isUploaded: false,
    type: 'file',
    timeStamp: new Date(),
  };
  // 更新预览视频的URL
  const objectUrl = URL.createObjectURL(file);
  previewVideoUrl.value = objectUrl;
};

// 处理录制完成
// blob 对象是摄像头录制过程中产生的二进制数据，包含了录制的视频内容
const handleRecordComplete = (blob) => {
  // 获取当前时间戳作为文件名
  const timeStamp = Date.now();
  // 转换为AVI格式的File对象，文件名使用时间戳
  const aviFile = new File([blob], `${timeStamp}.avi`, {
    type: 'video/x-msvideo',
  });
  handleAddVideo(aviFile);
  showCameraDialog.value = false;
};

// 删除视频
const handleDeleteVideo = () => {
  // 同时清除预览视频的URL
  previewVideoUrl.value = '';
  // 释放之前创建的ObjectURL
  //   if (video.value && video.value.file) {
  //     URL.revokeObjectURL(URL.createObjectURL(video.value.file));
  //   }
};

// 单个视频上传方法
const uploadVideo = (video) => {
  isTranslating.value = true;

  const formData = new FormData();
  formData.append('video', video.file);
  formData.append('videoId', video.id);

  formRequest
    .post('/api/infer', formData)
    .then((response) => {
      if (response.code === 200) {
        video.isUploaded = true;
        ElMessage({
          type: 'success',
          message: `${video.id}上传成功`,
        });
        // 上传成功后更新展示视频的URL
        videoUrl.value = response.data.videoUrl; // 假设响应中有视频的URL
      } else {
        ElMessage({
          type: 'error',
          message: `${video.id}上传失败`,
        });
      }
      isTranslating.value = false;
    })
    .catch((error) => {
      console.error('上传失败:', video.id, error);
    });
};

const handleVideoError = (error) => {
  console.error('视频播放错误:', error);
};
</script>

<style scoped>
.lCard {
  height: 70vh !important;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-right: 10px;
}

.rCard {
  height: 78vh !important;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.video-player {
  width: 100%; /* 可以根据需要调整宽度 */
  height: auto; /* 保持高度自适应，以维持视频的宽高比 */
}

.dataset-container-card {
  width: 70vw;
  margin: 4vh auto;
}

.dataset-container {
  padding: 20px;
}

.dataset-header {
  display: flex;
  flex-direction: row;
}

.card-header {
  font-size: 3vh;
}

ul {
  list-style-type: none; /* 去掉所有列表的标记 */
  padding-left: 0; /* 去掉默认缩进 */
}

.video-system {
  margin-top: 30px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
}

.video-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-show {
  margin-top: 5vh;
  border-radius: 5px;
}

.video-show2 {
  border-radius: 5px;
  border: 1px solid black;
}

.btnCenter {
  display: flex;
}

.el-main {
  border: 1px solid black;
}
</style>
