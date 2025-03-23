<template>
  <div class="control-panel">
    <el-button type="primary" @click="triggerFileInput">
      <i class="iconfont icon-shangchuan" />&nbsp;选择本地视频
    </el-button>

    <el-tooltip content="将打开本机摄像头进行录制">
      <el-button type="success" @click="emit('start-recording')">
        <i class="iconfont icon-luzhi" />&nbsp;摄像头录制
      </el-button>
    </el-tooltip>

    <el-button type="warning" @click="emit('upload-all')">
      <i class="iconfont icon-shangchuan1" />&nbsp;一键上传
    </el-button>

    <input type="file" ref="fileInput" hidden accept="video/*" @change="handleFileSelect" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-video', 'start-recording', 'upload-all']);

const fileInput = ref(null);

// 触发文件选择框
const triggerFileInput = () => {
  fileInput.value.click();
};

// 处理文件选择
const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 验证文件类型
    if (!file.type.includes('video')) {
      ElMessage.error('请选择视频文件');
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
