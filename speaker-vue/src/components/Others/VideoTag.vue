<template>
  <h2 style="margin-bottom: 10px">
    <el-icon><Promotion /></el-icon> 标注事宜
  </h2>
  <div style="color: red">
    <ul>
      <li>
        <el-icon><Star /></el-icon> 请选择对应的视频进行相应的意思标注方便模型训练
      </li>
      <li>
        <el-icon><Star /></el-icon> 标注字数请勿超过50字
      </li>
      <li>
        <el-icon><Star /></el-icon> 如果想要更改标注可以点击视频标签上的标识图案
      </li>
    </ul>
  </div>

  <el-tabs v-model="activeTab">
    <el-tab-pane :label="'全部 ' + videoList.length" name="all">
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
          <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)" class="right"
            ><i class="iconfont icon-shanchu"></i>
          </span>
          <el-tooltip
            v-if="value.tag === true"
            class="box-item"
            effect="dark"
            :content="value.number"
            placement="top"
          >
            <span @click="triggerChange(value)" class="right" v-if="value.tag === true"
              ><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i>
            </span>
          </el-tooltip>
        </div>

        <el-empty v-if="videoList.length === 0" description="暂无视频" />
      </div>
    </el-tab-pane>
    <el-tab-pane :label="'已标记 ' + isTagged.length" name="tagged">
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
          <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)" class="right"
            ><i class="iconfont icon-shanchu"></i>
          </span>
          <el-tooltip class="box-item" effect="dark" :content="value.number" placement="top">
            <span @click.stop="triggerChange(value)" class="right"
              ><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i>
            </span>
          </el-tooltip>
        </div>
        <el-empty v-if="isTagged.length === 0" description="暂无已标记视频" />
      </div>
    </el-tab-pane>
    <el-tab-pane :label="'未标记 ' + noTagged.length" name="noTagged">
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
          <span v-show="iconIfShow[index]" @click.stop="triggerDelete(value.title)" class="right"
            ><i class="iconfont icon-shanchu"></i>
          </span>
        </div>
        <el-empty v-if="noTagged.length === 0" description="暂无未标记视频" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import emittr from '@/utils/event-bus';

const props = defineProps({
  videoList: {
    type: Array,
    default: () => [],
  },
  isTagged: {
    type: Array,
    default: () => [],
  },
  noTagged: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['video-selected']);

const iconIfShow = ref([]);
const activeTab = ref('all');
const selectedVideo = ref(null);

const filteredVideos = computed(() => {
  switch (activeTab.value) {
    case 'tagged':
      return props.isTagged;
    case 'noTagged':
      return props.noTagged;
    default:
      return props.videoList;
  }
});

// 标签点击事件
const triggerChange = (video) => {
  emittr.emit('changeDialogVisible', video);
};

// 标签删除事件
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
  list-style-type: none;
  padding-left: 0;
}

.video-tag {
  height: 55vh !important;
  border-radius: 0.625rem;
}

.tag-body {
  overflow-y: auto;
  padding: 0.1875rem;
  display: flex;
  flex-direction: column;
  height: 45vh;
}

.videoinf {
  height: 2.8125rem;
  min-height: 2.8125rem;
  width: 95%;
  border-bottom: 0.0625rem black dotted;
  margin-top: 0.625rem;
  transition:
    transform 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
}

.videoinf:hover {
  background-color: rgb(242, 244, 243);
  transform: translateY(-0.125rem);
  cursor: default;
}

.videoinf.actived {
  background-color: rgb(242, 244, 243);
}

.right {
  float: right;
}

.right:hover {
  cursor: pointer;
}

.icon-shanchu:hover {
  color: red;
}

.tag-tip {
  font-size: 1vw;
}
</style>
