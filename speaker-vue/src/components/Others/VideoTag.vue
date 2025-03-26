<template>
  <div v-if="isMobile">
    <div class="notice-section" @click="dialogTips = true">
      <span>注意事项</span>
      <span><van-icon name="arrow-down" /></span>
    </div>

    <van-tabs v-model:active="activeName">
      <van-tab :title="'全部 ' + videoList.length.toString()" name="a">
        <div v-if="videoList.length" style="height: 62vh; border: 1px solid blue; overflow-y: auto">
          <van-list finished-text="没有更多了">
            <van-swipe-cell
              v-for="(video, index) in videoList"
              :key="index"
              style="border-bottom: 1px solid lightgray"
            >
              <van-cell
                :border="false"
                :title="video.title"
                :value="video.tag === true ? '已标记' : ''"
              />
              <template #right>
                <van-button square type="danger" text="删除" @click="triggerDelete(video.title)" />
                <van-button square type="primary" text="标记" @click="triggerChange(video)" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
        <van-empty v-else description="暂无视频" />
      </van-tab>
      <van-tab :title="'已标记 ' + isTagged.length.toString()" name="b">
        <div v-if="isTagged.length" style="height: 62vh; border: 1px solid blue; overflow-y: auto">
          <van-list finished-text="没有更多了">
            <van-swipe-cell
              v-for="(video, index) in isTagged"
              :key="index"
              style="border-bottom: 1px solid lightgray"
            >
              <van-cell :border="false" :title="video.title" value="已标记" />
              <template #right>
                <van-button square type="danger" text="删除" @click="triggerDelete(video.title)" />
                <van-button square type="primary" text="标记" @click="triggerChange(video)" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
        <van-empty v-else description="暂无已标记视频" />
      </van-tab>
      <van-tab :title="'未标记 ' + noTagged.length.toString()" name="c">
        <div v-if="noTagged.length" style="height: 62vh; border: 1px solid blue; overflow-y: auto">
          <van-list finished-text="没有更多了">
            <van-swipe-cell
              v-for="(video, index) in noTagged"
              :key="index"
              style="border-bottom: 1px solid lightgray"
            >
              <van-cell :border="false" :title="video.title" />
              <template #right>
                <van-button square type="danger" text="删除" @click="triggerDelete(video.title)" />
                <van-button square type="primary" text="标记" @click="triggerChange(video)" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
        <van-empty v-else description="暂无未标记视频" />
      </van-tab>
    </van-tabs>

    <!-- 提示弹窗 -->
    <van-popup v-model:show="dialogTips" position="bottom" style="height: 30%" closeable>
      <van-divider><span style="color: black; font-size: large">标注事宜</span></van-divider>
      <div class="tips-content">
        <ul>
          <li>
            <el-icon><Star /></el-icon> 请选择对应的视频进行相应意思标注方便模型训练
          </li>
          <li>
            <el-icon><Star /></el-icon> 标注字数请勿超过50字
          </li>
          <li>
            <el-icon><Star /></el-icon> 如果想要更改标注可以点击视频标签上的标识图案
          </li>
        </ul>
      </div>
    </van-popup>

    <van-popup v-model:show="dialogTags" position="bottom" style="height: 30%" closeable>
      <van-divider><span style="color: black; font-size: large">标注事宜</span></van-divider>
      <div class="tips-content">
        <ul>
          <li>
            <el-icon><Star /></el-icon> 请选择对应的视频进行相应意思标注方便模型训练
          </li>
          <li>
            <el-icon><Star /></el-icon> 标注字数请勿超过50字
          </li>
          <li>
            <el-icon><Star /></el-icon> 如果想要更改标注可以点击视频标签上的标识图案
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
  <!-- 非移动端内容 -->
  <div v-else>
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
            v-for="(video, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === video }"
            @click="handleVideoClick(video)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ video.title }}</span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(video.title)" class="right"
              ><i class="iconfont icon-shanchu"></i>
            </span>
            <el-tooltip
              v-if="video.tag === true"
              class="box-item"
              effect="dark"
              :content="video.number"
              placement="top"
            >
              <span @click="triggerChange(video)" class="right" v-if="video.tag === true"
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
            v-for="(video, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === video }"
            @click="handleVideoClick(video)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ video.title }}</span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(video.title)" class="right"
              ><i class="iconfont icon-shanchu"></i>
            </span>
            <el-tooltip class="box-item" effect="dark" :content="video.number" placement="top">
              <span @click.stop="triggerChange(video)" class="right"
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
            v-for="(video, index) of filteredVideos"
            :key="index"
            class="videoinf"
            :class="{ actived: selectedVideo === video }"
            @click="handleVideoClick(video)"
            @mouseenter="iconIfShow[index] = true"
            @mouseleave="iconIfShow[index] = false"
          >
            <span>{{ video.title }}</span>
            <span v-show="iconIfShow[index]" @click.stop="triggerDelete(video.title)" class="right"
              ><i class="iconfont icon-shanchu"></i>
            </span>
          </div>
          <el-empty v-if="noTagged.length === 0" description="暂无未标记视频" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import emittr from '@/utils/event-bus';
import { _isMobile } from '@/utils/isMobile';

const dialogTips = ref(false);
const dialogTags = ref(false);
const dialogEditModels = ref(false);

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
const activeName = ref('a');
const selectedVideo = ref(null);
const isMobile = computed(() => _isMobile());

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
/* 注意事项区域样式 */
.notice-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px lightgray solid;
}

/* 提示内容样式 */
.tips-content {
  padding: 10px;
}

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
