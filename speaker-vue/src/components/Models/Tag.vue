<template>
  <div class="tagbody">
    <div class="common-layout">
      <el-container>
        <el-aside width="500px"
          ><VideoShow :videoUrl="currentVideoUrl" :showObject="changeObject"></VideoShow
        ></el-aside>

        <el-divider style="margin: 2% 3vw; height: 60vh" direction="vertical" />

        <el-container>
          <el-main style="padding: 0"
            ><VideoTag
              :videoList="videoList"
              :isTagged="isTagged"
              :noTagged="noTagged"
              @video-selected="handleVideoSelected"
            ></VideoTag
          ></el-main>
        </el-container>
      </el-container>
    </div>

    <el-dialog
      v-model="dialogVisible"
      top="30vh"
      width="500"
      class="diaglog"
      :draggable="true"
      :align-center="true"
    >
      <h2 v-if="jd === 1">新增注解</h2>
      <h2 v-if="jd === 0">更改注解</h2>
      <h3 style="margin-top: 10px">{{ changeObject.title }}</h3>
      <div>
        <div v-if="jd === 0">旧标注为：{{ changeObject.number }}</div>
        <el-input type="text" v-model="tag" placeholder="请输入标注（字数小于15）" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="changeObject.tag === true" type="danger" @click="deleteTag"
            >删除标签</el-button
          >
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changeTag"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useUsedModelStore } from '@/stores/usedModel';
import request from '@/utils/request';
import VideoShow from '@/components/Others/VideoShow.vue';
import VideoTag from '@/components/Others/VideoTag.vue';
import emittr from '@/utils/event-bus';

const requestLocal = '/api';

const videoList = ref([]);
const currentVideoUrl = ref(null);
const dialogVisible = ref(false);
const changeObject = ref({});
const jd = ref(1);
const tag = ref('');
const usedModelStore = useUsedModelStore();

// 由此，传递过去的都是非响应式数据
const isTagged = computed(() => {
  return videoList.value.filter((video) => video.tag === true);
});

const noTagged = computed(() => {
  return videoList.value.filter((video) => video.tag === false);
});

// 获取所有的视频
const getAllVideos = () => {
  request
    .get('/api/list', {
      params: usedModelStore.usedModel.id,
    })
    .then((res) => {
      if (res.code == 200 && Array.isArray(res.data)) {
        videoList.value = res.data;
      } else {
        console.error('视频列表加载失败:', res);
        ElMessage.error('加载视频列表失败');
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error(err.message);
    });
};

// 选中的视频在左边框显示
const handleVideoSelected = (video) => {
  request // ????前端发送videoTitle即可，但请求头需设置 'multipart/form-data;charset=UTF-8'???????
    .get('/api/getVideo', {
      params: {
        videoTitle: video.title,
      },
    })
    .then((res) => {
      currentVideoUrl.value = requestLocal + res.url;
    })
    .catch((err) => console.log(err));
};

const changeDialogVisible = (video) => {
  changeObject.value = video;
  jd.value = 0;
  tag.value = '';
  dialogVisible.value = true;
};

const addTag = () => {
  if (changeObject.value) {
    if (changeObject.value.tag === true) {
      ElMessage.warning('该视频已有标注');
    } else {
      tag.value = '';
      dialogVisible.value = true;
      jd.value = 1;
    }
  } else {
    ElMessage.warning('请先选择要操作的视频');
  }
};

const change = (video) => {
  changeObject.value = video;
};

const changeTag = () => {
  if (tag.value === '' || tag.value.length > 15) {
    ElMessage.warning('输入的标识字数需要大于0且小于15');
    return;
  }
  changeObject.value.tag = true;
  changeObject.value.number = tag.value;
  request
    .put('/api/updateTag', changeObject.value)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          showClose: true,
          type: 'success',
          message: '标注成功',
        });
        dialogVisible.value = false;
        getAllVideos();
      } else {
        ElMessage.error('标注失败');
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error('标注失败');
    });
};

const deleteVideo = (videoTitle) => {
  ElMessageBox.confirm('此操作将永久删除该视频, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      request
        .delete('/api/deleteVideo', {
          params: {
            videoTitle: videoTitle,
          },
        })
        .then((res) => {
          if (res.code == 200) {
            ElMessage({
              showClose: true,
              type: 'success',
              message: '删除成功',
            });
            changeObject.value = {};
            getAllVideos();
          } else {
            ElMessage.error('删除失败');
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error('删除失败');
        });
    })
    .catch(() => {
      ElMessage({
        showClose: true,
        type: 'info',
        message: '已取消删除',
      });
    });
};

const deleteTag = () => {
  // ElMessageBox.confirm('此操作将永久删除该标识, 是否继续?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // });

  if (!changeObject.value || changeObject.value.tag === null) return;

  let videoTitle = changeObject.value.title;
  request
    .put('/api/deleteTag', null, {
      params: {
        videoTitle: videoTitle,
      },
    })
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          showClose: true,
          type: 'success',
          message: '删除标识成功',
        });
        dialogVisible.value = false;
        getAllVideos();
      } else {
        ElMessage.error('删除标识失败');
      }
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error('删除标识失败');
    });
};

onMounted(() => {
  getAllVideos();
  emittr.on('changeDialogVisible', changeDialogVisible);
  emittr.on('add', addTag);
  emittr.on('touch', change);
  emittr.on('deleteVideo', deleteVideo);
});

onBeforeUnmount(() => {
  emittr.off('deleteVideo', deleteVideo);
  emittr.off('changeDialogVisible', changeDialogVisible);
  emittr.off('add', addTag);
  emittr.off('touch', change);
});
</script>

<style scoped>
.tagbody {
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
