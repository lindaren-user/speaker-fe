<template>
  <div v-if="isMobile" style="display: flex; justify-content: center; gap: 20vw; margin-top: 2vh">
    <van-button type="primary" @click="triggerFileInput">
      <i class="iconfont icon-shangchuan" />&nbsp;视频选择
    </van-button>
    <van-button type="warning" @click="emit('upload')">
      <i class="iconfont icon-shangchuan1" />&nbsp;一键上传
    </van-button>
  </div>

  <div v-else class="control-panel">
    <el-button type="primary" @click="triggerFileInput">
      <i class="iconfont icon-shangchuan" />&nbsp;选择本地视频
    </el-button>

    <el-tooltip content="将打开本机摄像头进行录制">
      <el-button type="success" @click="emit('start-recording')">
        <i class="iconfont icon-luzhi" />&nbsp;摄像头录制
      </el-button>
    </el-tooltip>

    <el-button v-if="props.isNecklace" type="info" @click="necklaceRecording">
      <i class="iconfont icon-luzhi" />&nbsp;项链录制
    </el-button>

    <el-button type="warning" @click="emit('upload')">
      <i class="iconfont icon-shangchuan1" />&nbsp;一键上传
    </el-button>
  </div>

  <input type="file" ref="fileInput" hidden accept="video/*" @change="handleFileSelect" />
</template>

<script setup>
import { ErrorMessage } from '@/utils/others/messageTool';
import { _isMobile } from '@/utils/mobile/isMobile';

/* 公共变量 */
const fileInput = ref(null);
const emit = defineEmits(['add-video', 'start-recording', 'necklace-recording', 'upload']);

const props = defineProps({
  // 是否显示项链录制的功能
  isNecklace: {
    type: Boolean,
    default: false,
  },
});

const necklaceRecording = () => {
  // 检测是否开启该功能
  if (props.isNecklace) emit('necklace-recording');
};

/* 移动端 */
const isMobile = computed(() => _isMobile());

/* 函数 */
// 触发文件选择框
const triggerFileInput = () => {
  fileInput.value.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 验证文件类型
    if (!file.type.includes('video')) {
      ErrorMessage('请选择视频文件');
      return;
    }
    emit('add-video', file);
    fileInput.value.value = null;
  }
};
</script>

<style scoped>
.control-panel {
  display: flex;
  justify-content: center;
  height: 1.875rem;
}

.control-panel button {
  margin-right: 1.25rem;
}
</style>
