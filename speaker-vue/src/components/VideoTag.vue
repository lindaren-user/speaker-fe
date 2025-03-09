<template>
  <el-card class="video-tag" style="width: 27vw">
    <template #header>
      <h2>标注事宜</h2>
      <div style="color: red">
        <ul>
          <li>请选择对应的视频进行相应的意思标注方便模型训练</li>
          <li>标注字数请勿超过50字</li>
          <li>如果想要更改标注可以点击视频标签上的标识图案</li>
        </ul>
      </div>
    </template>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="'全部 ' + videoList.length + '/' + videoList.length" name="all">
        <div class="tag-body">
          <div
            v-for="(value, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === value }"
            @click="handleVideoClick(value)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ value.title }}</span>
            <span v-if="value.tag === true" @click="triggerChange(value)"><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i> </span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)"><i class="iconfont icon-shanchu" ></i> </span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'已标记 ' + isTagged.length + '/' + videoList.length" name="tagged">
        <div class="tag-body">
          <div
            v-for="(value, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === value }"
            @click="handleVideoClick(value)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ value.title }}</span>
            <span v-if="value.tag === true" @click="triggerChange(value)"><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i> </span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)"><i class="iconfont icon-shanchu" ></i> </span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'未标记 ' + noTagged.length + '/' + videoList.length" name="noTagged">
        <div class="tag-body">
          <div
            v-for="(value, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === value }"
            @click="handleVideoClick(value)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ value.title }}</span>
            <span v-if="value.tag === true" @click="triggerChange(value)"><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i> </span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)"><i class="iconfont icon-shanchu" ></i> </span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import emittr from "@/utils/event-bus";

// 定义 props
const props = defineProps({
  videoList: {
    type: Array,
    default: () => []
  },
  isTagged: {
    type: Array,
    default: () => []
  },
  noTagged: {
    type: Array,
    default: () => []
  }
});

// 定义 emits
const emit = defineEmits(['video-selected']);

// 定义响应式数据
const iconIfShow = ref([]);
const activeTab = ref('all');
const selectedVideo = ref(null);

// 计算属性
const filteredVideos = computed(() => {
  if (activeTab.value === 'all') {
    return props.videoList;
  } else if (activeTab.value === 'tagged') {
    return props.isTagged;
  } else if (activeTab.value === 'noTagged') {
    return props.noTagged;
  }
  return props.videoList; // 默认返回全部视频
});

// 方法定义
const triggerChange = (video) => {
  emittr.emit('changeDialogVisible', video);
};

const triggerDelete = (videoTitle) => {
  emittr.emit('deleteVideo', videoTitle);
};

const handleVideoClick = (video) => {
  selectedVideo.value = video;
  emit('video-selected', video);
  emittr.emit('touch', video);
};
</script>

<style scoped>
ul {
  list-style-type: none; /* 去掉所有列表的标记 */
  padding-left: 0; /* 去掉默认缩进 */
}
.video-tag {
  width: 25%;
  height: 74%;
  border-radius: 10px;
  min-height: 400px;
}
.tag-body{
  overflow-y: auto;
  padding: 3px;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：解除最小高度限制 */
  max-height: 320px;
}
.videoinf{
  height: 45px;
  min-height: 45px;
  border: rgb(44, 84, 212) solid 1px;
  border-radius: 10px;
  margin-top: 3px;
}
.videoinf:hover{
  background-color:green ;
}
.videoinf.actived{
  background-color: green;
}
.icon-shanchu:hover{
  color: red;
}
.el-tabs__item.is-active {
  color: rgb(44, 84, 212); /* 激活状态的标签颜色 */
}

/* 让标签页选项居中 */
.el-tabs__header {
  display: flex;
  justify-content: center;
}
</style>