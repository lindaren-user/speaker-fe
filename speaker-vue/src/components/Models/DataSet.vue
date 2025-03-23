<template>
  <div>
    <h2 style="margin-bottom: 10px">
      <el-icon><ZoomIn /></el-icon> 数据采集系统
    </h2>
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
  </div>

  <div class="dataset-container">
    <!-- 操作按钮组件 -->
    <ControlPanel
      @add-video="handleAddVideo"
      @start-recording="showCameraDialog = true"
      @upload-all="handleUploadAll"
    />

    <el-divider style="margin: 2% auto" />

    <VideoList :videos="videoList" @delete-video="handleDeleteVideo" />

    <!-- 摄像头录制对话框 -->
    <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
      <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onDeactivated, onUnmounted } from 'vue';
import { useUlCounterStore } from '@/stores/ulCounter';
import { useUsedModelStore } from '@/stores/usedModel';
import ControlPanel from '@/components/Others/ControlPanel.vue';
import VideoList from '@/components/Others/VideoList.vue';
import CameraRecorder from '@/components/Recorders/CameraRecorder.vue';
import formRequest from '@/utils/formRequest';

onDeactivated(() => {
  console.log('被缓存');
});

onUnmounted(() => {
  console.log('被销毁');
});

const videoList = ref([]);
const showCameraDialog = ref(false);
const nextVideoId = ref(1);
const ulCounterStore = useUlCounterStore();
const usedModelStore = useUsedModelStore();

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
  const unUploaded = videoList.value.filter((v) => !v.isUploaded);
  const length = unUploaded.length;
  if (length === 0) {
    ElMessage.warning('没有可上传视频');
    return;
  }
  try {
    await Promise.all(unUploaded.map(uploadVideo)); // 等待所有的视频处理完成
    if (unUploaded.every((v) => v.isUploaded)) {
      ElMessage({
        showClose: true,
        type: 'success',
        message: '全部上传成功',
      });
      ulCounterStore.changeCounter(length);
    }
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败，请检查网络连接');
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
  formData.append('modelId', usedModelStore.usedModel.id);

  return formRequest
    .post('/api/upload', formData)
    .then((res) => {
      if (res.code == 200) {
        video.isUploaded = true;
        // ElMessage({
        //   showClose: true,
        //   type: 'success',
        //   message: `${video.id}上传成功`,
        // });
      } else {
        ElMessage.error(`${video.id}上传失败`);
      }
      return res;
    })
    .catch((error) => {
      console.error('上传失败:', video.id, error);
      // ElMessage.error(`${video.id}上传失败`);
    });
};
</script>

<style scoped>
.dataset-container-card {
  width: 70vw;
  margin: 4vh auto;
}

.dataset-container {
  padding: 1.25rem;
}

.dataset-header {
  display: flex;
  flex-direction: row;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.video-system {
  margin-top: 1.875rem;
  border: 0.0625rem solid #ebeef5;
  border-radius: 0.5rem;
  padding: 1.25rem;
}
</style>
