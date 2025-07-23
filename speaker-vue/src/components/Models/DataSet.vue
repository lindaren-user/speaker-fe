<template>
  <div v-if="isMobile">
    <van-notice-bar left-icon="volume-o" :scrollable="false" mode="link" @click="dialogTips = true">
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item>视频数量限制为100，超出会被忽略</van-swipe-item>
        <van-swipe-item>视频尽可能覆盖所有使用场景，否则会使实机部署效果欠佳</van-swipe-item>
        <van-swipe-item>每个标签的视频数量最少10份，否则训练效果可能一般</van-swipe-item>
        <van-swipe-item>每个标签的视频数量尽量接近</van-swipe-item>
      </van-swipe>
    </van-notice-bar>

    <ControlPanel @add-video="handleAddVideo" @upload="handleUploadAll" />

    <div style="height: 60vh; overflow-y: auto">
      <VideoList :videos="videoList" @delete-video="handleDeleteVideo" />
    </div>

    <van-popup v-model:show="dialogTips" position="bottom" style="height: 40%" closeable>
      <van-divider><span style="color: black; font-size: large">数据采集</span></van-divider>
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
    </van-popup>
  </div>

  <div v-else>
    <h2 style="margin-bottom: 10px"></h2>
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

    <div class="dataset-container">
      <!-- 操作按钮组件 -->
      <ControlPanel
        @add-video="handleAddVideo"
        @start-recording="showCameraDialog = true"
        @necklace-recording="handleNecklaceRecordInit"
        @upload="handleUploadAll"
        :isNecklace="true"
      />

      <el-divider style="margin: 2% auto" />

      <VideoList :videos="videoList" @delete-video="handleDeleteVideo" />

      <!-- 摄像头录制对话框 -->
      <el-dialog v-model="showCameraDialog" title="摄像头录制" :close-on-click-modal="false">
        <CameraRecorder v-if="showCameraDialog" @record-complete="handleRecordComplete" />
      </el-dialog>

      <!-- 项链录制 -->
      <!-- 内部组件延迟渲染，所以一开始的framePlayer === null -->
      <el-dialog
        v-model="showNecklaceVideo"
        title="项链录制"
        :close-on-click-modal="false"
        @close="handleNecklaceRecordClose"
      >
        <FramePlayer
          ref="framePlayerRef"
          @record-complete="handleRecordComplete"
          :isOpened="showNecklaceVideo"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue';
import { useUlCounterStore } from '@/stores/ulCounter';
import { useProcessedModelStore } from '@/stores/processedModel';
import { files_service } from '@/apis/files_service';
import { _isMobile } from '@/utils/mobile/isMobile';
import ControlPanel from '@/components/Others/ControlPanel.vue';
import VideoList from '@/components/Others/VideoList.vue';
import CameraRecorder from '@/components/Recorders/CameraRecorder.vue';
import FramePlayer from './FramePlayer.vue';
import {
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
  MessageBox,
} from '@/utils/others/messageTool';

/* 公共变量 */
const videoList = ref([]);
const ulCounterStore = useUlCounterStore();
const processedModelStore = useProcessedModelStore();
const nextVideoId = ref(1);

const emit = defineEmits(['upload-finish']);

/* 移动端 */
const isMobile = computed(() => _isMobile());

const dialogTips = ref(false);

/* pc端 */
const showCameraDialog = ref(false);
const showNecklaceVideo = ref(false);

const framePlayerRef = ref(null);

/* 函数 */
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

// 开启项链录制
const handleNecklaceRecordInit = () => {
  showNecklaceVideo.value = true;

  // 用 nextTick 确保 DOM 渲染完成
  nextTick(() => {
    if (framePlayerRef.value) {
      framePlayerRef.value.initWS();
    }
  });
};

// 关闭项链录制
const handleNecklaceRecordClose = () => {
  showNecklaceVideo.value = false; // 手动关闭，避免 isOpened 判断错误
  if (framePlayerRef.value) {
    framePlayerRef.value.closeWS();
  }
};

// 处理录制完成
// blob 对象是摄像头录制过程中产生的二进制数据，包含了录制的视频内容
const handleRecordComplete = (blob, type) => {
  // 获取当前时间戳作为文件名
  const timeStamp = Date.now();

  // 转换为File对象，文件名使用时间戳
  let file = null;
  if (type === 'avi')
    file = new File([blob], `${timeStamp}.avi`, {
      type: 'video/x-msvideo',
    });
  else
    file = new File([blob], `${timeStamp}.webm`, {
      type: 'video/webm',
    });

  // file = new File([blob], `${timeStamp}.avi`, {
  //   type: 'video/x-msvideo',
  // });
  handleAddVideo(file);
  showCameraDialog.value = false;
};

// 批量上传
const handleUploadAll = async () => {
  const unUploaded = videoList.value.filter((v) => !v.isUploaded);
  const length = unUploaded.length;
  if (length === 0) {
    WarningMessage('无可上传视频');
    return;
  }
  try {
    await Promise.all(unUploaded.map(uploadVideo)); // 等待所有的视频处理完成
    if (unUploaded.every((video) => video.isUploaded)) {
      SuccessMessage('全部上传成功');
      ulCounterStore.changeCounter(length);
    }
    emit('upload-finish');
  } catch (err) {
    console.error('上传失败:', err);
    ErrorMessage('上传失败，请检查网络连接');
  }
};

// 删除视频
const handleDeleteVideo = (id) => {
  MessageBox('视频').then(() => {
    videoList.value = videoList.value.filter((v) => v.id !== id);
    SuccessMessage('删除成功');
  });
};

// 单个视频上传方法
const uploadVideo = (video) => {
  const formData = new FormData();
  formData.append('video', video.file);
  formData.append('videoId', video.id);
  formData.append('modelId', processedModelStore.processedModel.id);

  return files_service.video
    .uploadAllVideos(formData)
    .then((res) => {
      if (res.code === '200') {
        video.isUploaded = true;
      } else {
        console.log(res.msg);
        ErrorMessage(`${video.id}上传失败`);
      }
      return res;
    })
    .catch((error) => {
      console.error('上传失败:', video.id, error);
    });
};
</script>

<style scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}

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
