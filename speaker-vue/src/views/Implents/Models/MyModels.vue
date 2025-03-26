<template>
  <div v-if="isMobile">
    <van-divider><span style="color: black; font-size: large">我的模型</span></van-divider>
    <div style="display: flex; justify-content: right; margin-bottom: 1vh">
      <el-button type="primary"><van-icon name="plus" /></el-button>
    </div>
    <div style="height: 78vh; border: 1px black solid; overflow: auto">
      <van-list finished-text="没有更多了">
        <van-checkbox-group v-model="selectedModels">
          <van-swipe-cell
            v-for="(model, index) in modelList"
            :key="index"
            style="margin-bottom: 0.625rem; border: 1px dotted black; height: 9vh"
          >
            <div @click="editModel(index)">
              <div
                style="height: 10vh; display: flex; justify-content: space-between; padding: 10px"
              >
                <span style="font-size: 1.1rem">{{ model.name }}</span
                ><span
                  ><span><van-checkbox :name="model.id">使用</van-checkbox></span></span
                >
              </div>
              <div style="text-align: right">
                <span style="margin-right: 10px">{{ model.datetime }}</span>
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                @click="deleteModel(index)"
                style="height: 9vh"
              />
              <van-button
                square
                type="primary"
                text="编辑"
                @click="dialogEditModels = true"
                style="height: 9vh"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </van-list>
    </div>
    <div v-if="modelList.length === 0">
      <van-empty description="您还没有模型" />
    </div>
    <van-popup
      v-model:show="dialogEditModels"
      position="bottom"
      :style="{ height: '50%' }"
      closeable
    >
      <van-cell-group inset style="margin-top: 10%">
        <van-field v-model="name" label="名称" placeholder="模型名称" required="auto" />
        <van-field
          v-model="description"
          rows="2"
          autosize
          label="描述"
          type="textarea"
          maxlength="150"
          placeholder="模型简单介绍"
          show-word-limit
        />
      </van-cell-group>
      <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20%">
        <van-button type="warning" style="width: 100px" @click="resetModelInfo">重置</van-button>
        <van-button type="success" style="width: 100px" @click="saveModelInfo">保存</van-button>
      </div>
    </van-popup>
  </div>
  <div v-else>
    <el-card class="models-container-card">
      <template #header>
        <div class="header-container">
          <span style="font-size: 1.25rem"
            >我的模型<span style="font-size: 1rem; margin-left: 10px"
              >总共{{ modelList.length }}个,已使用{{ selectedModels.length }}个</span
            ></span
          >
          <el-button type="primary" @click="newModel">新建模型</el-button>
        </div>
      </template>
      <div class="models-list-container">
        <template v-if="modelList.length">
          <el-checkbox-group v-model="selectedModels" size="small">
            <el-card v-for="(model, index) in modelList" :key="model.id" class="model-item">
              <div class="model-content">
                <span class="model-name" @click="editModel(index)"
                  ><el-icon><Memo /></el-icon> {{ model.name }}</span
                >
                <div class="model-actions">
                  <el-checkbox :value="model.id">
                    <span class="radio-label">翻译使用</span>
                  </el-checkbox>
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
              <el-divider style="margin: 2% auto" />
              <div class="footer">
                <span>{{ model.datetime }}</span>
              </div>
            </el-card>
          </el-checkbox-group>
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
          <el-button @click="resetModelInfo">重置</el-button>
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
          <el-button @click="resetModelInfo">重置</el-button>
          <el-button type="primary" @click="saveModelInfo">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useProcessedModelStore } from '@/stores/processedModel';
import { useUsedModelStore } from '@/stores/usedModel';
import { _isMobile } from '@/utils/isMobile';
import { ErrorMessage, MessageBox, SuccessMessage, WarningMessage } from '@/utils/messageTool';
import { models_service } from '@/apis/models_service';

const router = useRouter();
const dialogNewModels = ref(false);
const dialogEditModels = ref(false);
const userStore = useUserStore();
const processedModelStore = useProcessedModelStore();
const usedModelStore = useUsedModelStore();
const isMobile = computed(() => _isMobile());

const name = ref('');
const description = ref('');

const modelList = ref([
  {
    id: 1,
    name: '日常出行',
    datetime: '2025.3.20',
  },
  {
    name: '旅游',
    datetime: '2025.3.20',
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
  {
    name: '医院看病',
    time: '2025.1.4',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
  {
    name: '医院看病',
    time: '2025.1.4',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
  {
    name: '医院看病',
    time: '2025.1.4',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
  {
    name: '远门常用',
    time: '2025.1.5',
  },
]);

const names = new Set();

const selectedModels = ref([]);

const editModelInfo = (index) => {
  processedModelStore.changeProcessedModel(modelList.value[index]);

  dialogEditModels.value = true;

  name.value = modelList.value[index].name;
  description.value = modelList.value[index]?.description;
};

const saveModelInfo = () => {
  const modelId = processedModelStore.processedModel.id;
  models_service
    .updateModel({
      name: name.value,
      profile: description.value,
      id: modelId,
      author: userStore.user,
    })
    .then((res) => {
      if (res.code === '200') {
        const index = modelList.value.findIndex((model) => model.id === modelId);
        modelList.value[index].name = res.data.name;
        modelList.value[index].description = res.data.profile;
        modelList.value[index].datetime = res.data.datetime;

        SuccessMessage('编辑成功');
        dialogEditModels.value = false;
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('编辑失败');
    });
};

const deleteModel = (index) => {
  MessageBox('模型').then(() => {
    models_service
      .deleteModel({
        params: {
          modelId: modelList.value[index].id,
        },
      })
      .then((res) => {
        if (res.code === '200') {
          names.delete(modelList.value[index].name);

          modelList.value.splice(index, 1);
          if (selectedModels.value === index) {
            selectedModels.value = '';
          }

          SuccessMessage('删除成功');
        } else {
          console.log(res.msg);
          ErrorMessage(res.msg);
        }
      })
      .catch((err) => {
        console.log(err.message);
        ErrorMessage('删除失败');
      });
  });
};

const newModel = () => {
  dialogNewModels.value = true;

  resetModelInfo();
};

const editModel = (index) => {
  processedModelStore.changeProcessedModel(modelList.value[index]);

  router.push('/implents/models/newModels');
};

const createModel = () => {
  if (!name.value) {
    WarningMessage('名字不能为空');
    return;
  }

  if (names.has(name.value)) {
    WarningMessage('名字重复，重新输入');
    return;
  }

  models_service
    .addModel({
      name: name.value,
      profile: description.value,
      author: userStore.user,
    })
    .then((res) => {
      if (res.code === '200') {
        const { id, datetime } = res.data;

        const newModel = {
          name: name.value,
          description: description.value,
          datetime,
          id,
        };
        modelList.value.push(newModel);
        processedModelStore.changeProcessedModel(newModel);

        SuccessMessage('创建成功');
        router.push('/implents/models/newModels');
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('创建失败');
    });
};

const resetModelInfo = () => {
  name.value = '';
  description.value = '';
};

const getAllModels = () => {
  models_service
    .getAllModels()
    .then((res) => {
      if (res.code === '200' && Array.isArray(res.data)) {
        modelList.value = res.data;

        modelList.value.forEach((model) => names.add(model.name));
        selectedModels.value = modelList.value.findIndex(
          (model) => model.name === usedModelStore.usedModel.name,
        );
      } else {
        console.log(res.msg);
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.log(err.message);
      ErrorMessage('获取失败');
    });
};

onMounted(() => {
  getAllModels();

  if (usedModelStore.usedModel && usedModelStore.usedModel.length !== 0) {
    selectedModels.value = usedModelStore.usedModel;
  }
});

onUnmounted(() => {
  usedModelStore.changeUsedModel(selectedModels.value);
});
</script>

<style scoped>
.models-container-card {
  width: 50vw;
  margin: 0 auto;
  height: 85vh;
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
  height: 75vh !important;
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
  margin-right: 10px;
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
</style>
