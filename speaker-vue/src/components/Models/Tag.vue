<template>
  <div v-if="isMobile">
    <VideoTag
      :videoList="videoList"
      :isTagged="isTagged"
      :noTagged="noTagged"
      @video-selected="handleVideoSelected"
      @deleteVideo="deleteVideo"
      @addTag="addTag"
      @openTagDlg="openDlg"
    ></VideoTag>

    <van-popup v-model:show="openTagDlg" position="bottom" :style="{ height: '50%' }" closeable>
      <van-divider
        ><span style="color: black">{{ changeObject.title }}</span></van-divider
      >
      <van-cell-group inset style="margin-top: 10%">
        <van-field
          v-model="tag"
          rows="2"
          autosize
          label="标注"
          type="textarea"
          maxlength="15"
          show-word-limit
        />
      </van-cell-group>
      <div style="display: flex; justify-content: center; gap: 30px; margin-top: 8vh">
        <van-button type="warning" style="width: 100px" @click="openTagDlg = false"
          >取消</van-button
        >
        <van-button type="success" style="width: 100px" @click="changeTag">确认</van-button>
      </div>
    </van-popup>

    <VideoShow
      :videoUrl="currentVideoUrl"
      :showObject="changeObject"
      @update:videoUrl="updateVideoUrl"
    ></VideoShow>
  </div>

  <div v-else>
    <div class="tagBody">
      <el-container>
        <el-aside width="590px"
          ><VideoShow
            :videoUrl="currentVideoUrl"
            :showObject="changeObject"
            @addTag="addTag"
          ></VideoShow
        ></el-aside>

        <el-divider style="margin: 15px; height: 60vh" direction="vertical" />

        <el-main style="padding: 0"
          ><VideoTag
            :videoList="videoList"
            :isTagged="isTagged"
            :noTagged="noTagged"
            @video-selected="handleVideoSelected"
            @deleteVideo="deleteVideo"
            @openTagDlg="openDlg"
          ></VideoTag
        ></el-main>
      </el-container>
    </div>

    <el-dialog
      v-model="openTagDlg"
      top="30vh"
      width="500"
      class="diaglog"
      :draggable="true"
      :align-center="true"
    >
      <h2 v-if="jd === 1">新增注解</h2>
      <h2 v-if="jd === 0">更改注解</h2>
      <h3 style="margin: 10px 0">{{ changeObject.title }}</h3>
      <div>
        <el-input type="text" v-model="tag" placeholder="请输入标注（字数小于15）" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="changeObject.tag === true" type="danger" @click="deleteTag"
            >删除标签</el-button
          >
          <el-button @click="openTagDlg = false">取消</el-button>
          <el-button type="primary" @click="changeTag">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useProcessedModelStore } from '@/stores/processedModel';
import { files_service } from '@/apis/files_service';
import { _isMobile } from '@/utils/mobile/isMobile';
import VideoShow from '@/components/Others/VideoShow.vue';
import VideoTag from '@/components/Others/VideoTag.vue';
import {
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
  MessageBox,
} from '@/utils/others/messageTool';

/* 公共变量 */
const changeObject = ref(null);
const videoList = ref([]);
const requestLocal = '/api';
const currentVideoUrl = ref('');
const tag = ref('');

const isTagged = computed(() => videoList.value.filter((video) => video.tag === true));
const noTagged = computed(() => videoList.value.filter((video) => video.tag === false));

const openTagDlg = ref(false);

const processedModelStore = useProcessedModelStore();

// 使用 map 缓存视频的链接, 减少服务器压力
const videoUrls = new Map();

/* 移动端 */
const isMobile = computed(() => _isMobile());

/* pc端 */
const jd = ref(1);

/* 函数 */
const updateVideoUrl = (url) => {
  currentVideoUrl.value = url;
};

// 获取所有的视频
const getAllVideos = () => {
  files_service.video
    .getAllVideos({
      params: {
        modelId: processedModelStore.processedModel.id,
      },
    })
    .then((res) => {
      if (res.code === '200' && Array.isArray(res.data)) {
        videoList.value = res.data;
      } else {
        console.error('视频列表加载失败:', res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('加载视频列表失败');
    });
};

// 选中的视频在左边框显示
const handleVideoSelected = (video) => {
  changeObject.value = video; // 注意更新

  if (videoUrls.has(video.title)) {
    currentVideoUrl.value = videoUrls.get(video.title);
    return;
  }

  files_service.video
    .getSelectVideo({
      params: {
        videoTitle: video.title,
      },
    })
    .then((res) => {
      if (res.code === '200') {
        currentVideoUrl.value = requestLocal + res.url;
        videoUrls.set(video.title, currentVideoUrl.value);
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('视频展示出错');
    });
};

// 标签点击事件 number 与 tag
const openDlg = (video) => {
  changeObject.value = video;
  jd.value = 0;
  if (changeObject.value.tag) {
    tag.value = changeObject.value.number;
  } else {
    tag.value = '';
  }
  openTagDlg.value = true;
};

const addTag = () => {
  if (changeObject.value) {
    if (changeObject.value.tag === true) {
      openDlg(changeObject.value);
    } else {
      tag.value = '';
      openTagDlg.value = true;
      jd.value = 1;
    }
  } else {
    WarningMessage('请先选择要操作的视频');
  }
};

const checkAllTags = () => {
  return noTagged.value.length === 0;
};

const changeTag = () => {
  if (tag.value === '' || tag.value.length > 15) {
    WarningMessage('输入的标识字数需要大于0且小于15');
    return;
  }

  // 发送temp，防止修改失败出现的错误
  let tempVideo = { ...changeObject.value };
  tempVideo.tag = true;
  tempVideo.number = tag.value;

  files_service.video
    .updateVideoTag(tempVideo)
    .then((res) => {
      if (res.code === '200') {
        changeObject.value.tag = true;
        changeObject.value.number = tag.value;

        let nextRes = '';
        if (checkAllTags()) nextRes = '，可以前往下一步';
        SuccessMessage(`标注成功${nextRes}`);

        openTagDlg.value = false;
      } else {
        ErrorMessage('标注失败');
      }
    })
    .catch((err) => {
      console.log(err);
      ErrorMessage('标注失败');
    });
};

const deleteVideo = (videoTitle) => {
  MessageBox('视频').then(() => {
    files_service.video
      .deleteVideo({
        params: {
          videoTitle: videoTitle,
        },
      })
      .then((res) => {
        if (res.code === '200') {
          SuccessMessage('删除成功');
          changeObject.value = null; // 被选中的视频置空

          videoList.value = videoList.value.filter((video) => video.title !== videoTitle);
        } else {
          console.log(res.msg);
          ErrorMessage('删除失败');
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorMessage('删除失败');
      });
  });
};

const deleteTag = () => {
  if (!changeObject.value || changeObject.value.tag === null) return;

  let videoTitle = changeObject.value.title;
  MessageBox('标识').then(() => {
    files_service.video
      .deleteVideoTag({
        params: {
          videoTitle: videoTitle,
        },
      })
      .then((res) => {
        if (res.code === '200') {
          openTagDlg.value = false;

          SuccessMessage('删除标识成功');

          changeObject.value.number = '';
          changeObject.value.tag = false;

          getAllVideos();
        } else {
          console.log(res.msg);
          ErrorMessage('删除标识失败');
        }
      })
      .catch((err) => {
        console.log(err.message);
        ErrorMessage('删除标识失败');
      });
  });
};

onMounted(() => getAllVideos());
</script>

<style scoped>
.tagBody {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 95%;
  flex: 1;
}

.diaglog {
  height: 60%;
}
</style>
