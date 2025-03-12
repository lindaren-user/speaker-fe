<template>
  <el-card class="dataset-container-card">
    <template #header>
      <h2 style="margin-bottom: 10px">数据采集系统</h2>
      <div>
        <ul>
          <li>
            <el-icon><Star /></el-icon> 视频数量限制为100，超出该数量的视频会被忽略
          </li>
          <li>
            <el-icon><Star /></el-icon> 视频尽可能覆盖所有使用场景，否则会导致实机部署效果欠佳
          </li>
          <li>
            <el-icon><Star /></el-icon> 每个标签的视频数量最少10份，否则训练效果可能一般
          </li>
          <li>
            <el-icon><Star /></el-icon> 每个标签的视频数量尽量接近
          </li>
        </ul>
      </div>
    </template>
    <div class="dataset-container">
      <!-- 操作按钮组件 -->
      <ControlPanel
        @add-video="handleAddVideo"
        @start-recording="showCameraDialog = true"
        @upload-all="handleUploadAll"
        :disabled="controlDisabled"
      />

      <!-- 视频展示组件 -->
      <VideoList class="video-list" :videos="videoList" @delete-video="handleDeleteVideo" />

      <!-- 摄像头录制对话框 -->
      <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
        <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import ControlPanel from '@/components/ControlPanel.vue';
import VideoList from '@/components/VideoList.vue';
import CameraRecorder from '@/components/CameraRecorder.vue';
import formRequest from '@/utils/formRequest';

const videoList = ref([]);
const showCameraDialog = ref(false);
const nextVideoId = ref(1);
const controlDisabled = ref(false);

// 处理添加视频
const handleAddVideo = (file) => {
  videoList.value.push({
    id: `video_${new Date().getTime()}${nextVideoId.value++}`,
    file,
    isUploaded: false,
    type: 'file',
    timeStamp: new Date(),
  });
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

// 批量上传
const handleUploadAll = async () => {
  controlDisabled.value = true;
  const unUploaded = videoList.value.filter((v) => !v.isUploaded);
  if (unUploaded.length === 0) {
    ElMessage({
      type: 'warning',
      message: '所有视频均已上传！',
    });
    controlDisabled.value = false;
    return;
  }
  try {
    await Promise.all(unUploaded.map(uploadVideo)); // 并行处理
    if (unUploaded.every((v) => v.isUploaded)) {
      ElMessage.success('全部上传成功');
    }
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败，请检查网络连接');
  } finally {
    controlDisabled.value = false;
  }
};

// 删除视频
const handleDeleteVideo = (id) => {
  videoList.value = videoList.value.filter((v) => v.id !== id);
};

// 单个视频上传方法
const uploadVideo = (video) => {
  const formData = new FormData();
  formData.append('video', video.file);
  formData.append('videoId', video.id);

  return formRequest
    .post('/api/upload', formData)
    .then((response) => {
      if (response.code === 200) {
        video.isUploaded = true;
        ElMessage({
          type: 'success',
          message: `${video.id}上传成功`,
        });
      } else {
        ElMessage({
          type: 'error',
          message: `${video.id}上传失败`,
        });
      }
      return response;
    })
    .catch((error) => {
      console.error('上传失败:', video.id, error);
      throw error; // 继续传递错误
    });
};
</script>

<style scoped>
.dataset-container-card {
  width: 70vw;
  margin: 0 auto;
}

.dataset-container {
  padding: 20px;
}

.dataset-header {
  display: flex;
  flex-direction: row;
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
</style>
