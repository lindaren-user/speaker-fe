<template>
  <el-card class="models-container-card">
    <template #header>
      <div class="header-container">
        <span style="font-size: 1.25rem">我的模型</span>
        <el-button type="primary" @click="newModel">新建模型</el-button>
      </div>
    </template>
    <div class="models-list-container">
      <template v-if="modelsList.length">
        <el-card v-for="(model, index) in modelsList" :key="index" class="model-item">
          <div class="model-content">
            <span class="model-name" @click="editModel(index)">{{ model.name }}</span>
            <div class="model-actions">
              <el-radio v-model="selectedModel" :label="index">
                <span class="radio-label">翻译使用</span>
              </el-radio>
              <el-dropdown>
                <el-icon size="20" class="moreFilled"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editModelInfo(index)">
                      <el-icon><Edit /></el-icon>编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteModel(index)">
                      <el-icon><Delete /></el-icon>删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-divider style="margin: 1% auto" />
          <div class="footer">
            <span>{{ model.datatime }}</span>
          </div>
        </el-card>
      </template>
      <div v-else class="noModel">
        <el-empty description="暂无模型" />
      </div>
    </div>
  </el-card>

  <el-dialog
    class="dia"
    v-model="dialogNewModels"
    title="新建模型"
    draggable
    width="30%"
    :close-on-click-modal="false"
  >
    <div class="header">名字：</div>
    <el-input
      v-model="name"
      :rows="2"
      type="textarea"
      placeholder="请输入该模型的名称"
      class="input"
    />
    <div class="header">简介：</div>
    <el-input
      v-model="description"
      :rows="5"
      type="textarea"
      placeholder="请输入对于该模型的简单介绍"
      maxlength="150"
      show-word-limit
      class="input"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetInfo">重置</el-button>
        <el-button type="primary" @click="createModel">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogEditModels"
    title="编辑模型"
    width="30%"
    draggable
    :close-on-click-modal="false"
  >
    <div class="header">名字：</div>
    <el-input
      v-model="name"
      :rows="2"
      type="textarea"
      placeholder="请输入该模型的名称"
      class="input"
    />
    <div class="header">简介：</div>
    <el-input
      v-model="description"
      :rows="5"
      type="textarea"
      placeholder="请输入对于该模型的简单介绍"
      maxlength="150"
      show-word-limit
      class="input"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetInfo">重置</el-button>
        <el-button type="primary" @click="SaveModelInfo">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useUsedModelStore } from '@/stores/usedModel';
import request from '@/utils/request';

const router = useRouter();
const dialogNewModels = ref(false);
const dialogEditModels = ref(false);
const userStore = useUserStore();
const usedModelStore = useUsedModelStore();

const name = ref('');
const description = ref('');

const modelsList = ref([
  {
    name: '日常出行',
    time: '2025.3.22',
  },
  {
    name: '旅游',
    time: '2025.3.20',
  },
  {
    name: '购物',
    time: '2025.1.3',
  },
  {
    name: '医院看病',
    time: '2025.1.4',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
]);

const names = new Set();

const selectedModel = ref('');

const editModelInfo = (index) => {
  dialogEditModels.value = true;

  name.value = modelsList.value[index].name;
  description.value = modelsList.value[index]?.description;
};

const SaveModelInfo = () => {
  const modelId = usedModelStore.usedModel.id;
  request
    .put('/api/updateModel', {
      name: name.value,
      profile: description.value,
      id: modelId,
      author: userStore.user,
      datatime: usedModelStore.usedModel.datatime,
    })
    .then((res) => {
      if (res.code == 200) {
        const index = modelsList.value.findIndex((model) => model.id === modelId);
        modelsList.value[index].name = name.value;
        modelsList.value[index].description = description.value;

        ElMessage({
          showClose: true,
          type: 'success',
          message: '编辑成功',
        });
        dialogEditModels.value = false;
      } else {
        console.log(res.msg);
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ElMessage.error('编辑失败');
    });
};

const deleteModel = (index) => {
  ElMessageBox.confirm('此操作将永久删除该模型, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    request
      .delete('/api/deleteModel', {
        params: modelsList.value[index].id,
      })
      .then((res) => {
        if (res.code == 200) {
          names.delete(modelsList.value[index].name);

          modelsList.value.splice(index, 1);
          if (selectedModel.value === index) {
            selectedModel.value = '';
          }

          ElMessage({
            showClose: true,
            type: 'success',
            message: '删除成功',
          });
        } else {
          console.log(res.msg);
          ElMessage.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err.message);
        ElMessage.error('删除失败');
      });
  });
};

const newModel = () => {
  dialogNewModels.value = true;

  resetInfo();
};

const editModel = (index) => {
  usedModelStore.changeUsedModel(modelsList.value[index]);

  router.push('/implents/models/newModels');
};

const createModel = () => {
  if (!name.value) {
    ElMessage.warning('名字不能为空');
    return;
  }

  if (names.has(name.value)) {
    ElMessage.warning('名字重复，重新输入');
    return;
  }

  request
    .post('/api/addModel', {
      name: name.value,
      profile: description.value,
      author: userStore.user,
    })
    .then((res) => {
      if (res.code == 200) {
        const { id, datatime } = res.data;

        const newModel = {
          name: name.value,
          description: description.value,
          datatime,
          id,
        };
        modelsList.value.push(newModel);
        usedModelStore.changeUsedModel(newModel);

        ElMessage({
          showClose: true,
          type: 'success',
          message: '创建成功',
        });
        router.push('/implents/models/newModels');
      } else {
        console.log(res.msg);
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ElMessage.error('创建失败');
    });
};

const resetInfo = () => {
  name.value = '';
  description.value = '';
};

onMounted(() => {
  request
    .get('/api/modelList')
    .then((res) => {
      if (res.code == 200 && Array.isArray(res.data)) {
        modelsList.value = res.data;
        ElMessage({
          showClose: true,
          type: 'success',
          message: '成功获取模型列表',
        });

        modelsList.value.forEach((model) => names.add(model.name));
      } else {
        console.log(res.msg);
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ElMessage.error('获取模型列表失败');
    });
});
</script>

<style scoped>
.models-container-card {
  width: 50vw;
  margin: 0 auto;
  height: 43.75rem;
  display: flex;
  flex-direction: column;
}

.header-container {
  display: flex;
  justify-content: space-between;
}

.models-list-container {
  flex: 1;
  padding: 0.5rem;
  height: 40.625rem !important;
  overflow-y: auto;
}

.model-item {
  margin-bottom: 1rem;
}

.model-item:hover {
  transform: translateY(-0.1875rem);
}

.model-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-name {
  font-size: 1.2rem;
  cursor: pointer;
}

.model-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-label {
  font-size: 0.9rem;
  color: #333;
}

.moreFilled:hover {
  color: #66c18c;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9rem;
}

.noModel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header {
  padding-bottom: 2%;
}

.input {
  margin-bottom: 5%;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: rgb(242, 244, 243) !important;
  color: black !important;
}

@media screen and (max-width: 400px) {
  :deep(.el-dialog) {
    width: 90%;
  }
}
</style>
