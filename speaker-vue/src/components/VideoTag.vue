<template>
  <el-space direction="vertical" :size="20">
    <el-card class="tag-tip" style="width: 28vw">
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
    </el-card>
    <el-card class="video-tag" style="width: 28vw">
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
              <span
                v-show="iconIfShow[index]"
                @click.stop="triggerDelete(value.title)"
                class="right"
                ><i class="iconfont icon-shanchu"></i>
              </span>
              <span @click="triggerChange(value)" class="right" v-if="value.tag === true"
                ><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i>
              </span>
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
              <span
                v-show="iconIfShow[index]"
                @click.stop="triggerDelete(value.title)"
                class="right"
                ><i class="iconfont icon-shanchu"></i>
              </span>
              <span @click="triggerChange(value)" class="right"
                ><i class="iconfont icon-biaoshi" style="color: #41ae3c"></i>
              </span>
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
              <span
                v-show="iconIfShow[index]"
                @click.stop="triggerDelete(value.title)"
                class="right"
                ><i class="iconfont icon-shanchu"></i>
              </span>
            </div>
            <el-empty v-if="noTagged.length === 0" description="暂无未标记视频" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-space>
</template>

<script setup>
import { ref, computed } from 'vue';
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
      return toRaw(props.videoList);
  }
});

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
  height: 55vh !important;
  border-radius: 10px;
}
.tag-body {
  overflow-y: auto;
  padding: 3px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
  height: 45vh;
  /* overflow: auto; */
}
.videoinf {
  height: 45px;
  min-height: 45px;
  width: 95%;
  border-bottom: 1px black dotted;
  margin-top: 10px;
  transition:
    transform 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
}

.videoinf:hover {
  background-color: rgb(242, 244, 243);
  transform: translateY(-2px);
}
.videoinf.actived {
  background-color: rgb(242, 244, 243);
}
.right {
  float: right;
}
.icon-shanchu:hover {
  color: red;
}
.tag-tip {
  font-size: 1vw;
}
</style>
