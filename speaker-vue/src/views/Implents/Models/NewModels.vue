<template>
  <div v-if="isMobile">
    <van-nav-bar :title="modelName" left-arrow @click-left="router.go(-1)" />
    <van-steps :active="active">
      <van-step @click="active = 0">数据采集</van-step>
      <van-step @click="active = 1">语料定义</van-step>
      <van-step @click="active = 2">模型训练</van-step>
    </van-steps>
    <van-floating-bubble
      axis="xy"
      icon="arrow"
      magnetic="x"
      @click="nextStep"
      v-model:offset="offset"
    />

    <div class="newModel">
      <DataSet v-if="active === 0" />
      <Tag v-else-if="active === 1" />
      <Infer v-else />
    </div>
  </div>

  <div v-else>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/implents/models/myModels' }">我的模型</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-size: 1.2rem">{{ modelName }}</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="models-body">
      <template #header>
        <div class="step">
          <el-steps :active="active" align-center>
            <el-step title="数据采集" class="step-item" @click="active = 0" />
            <el-step title="语料定义" class="step-item" @click="active = 1" />
            <el-step title="模型训练" class="step-item" @click="active = 2" />
          </el-steps></div
      ></template>
      <DataSet v-if="active === 0" @upload-finish="active = 1" />
      <Tag v-else-if="active === 1" />
      <Infer v-else />
    </el-card>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { useProcessedModelStore } from '@/stores/processedModel';
import { _isMobile } from '@/utils/mobile/isMobile';
import DataSet from '@/components/Models/DataSet.vue';
import Tag from '@/components/Models/Tag.vue';
import Infer from '@/components/Models/Infer.vue';

/* 公共变量 */
const router = useRouter();
const processedModelStore = useProcessedModelStore();
const modelName = computed(() => processedModelStore.processedModel.name);

/* 移动端 */
const isMobile = computed(() => _isMobile());
const offset = ref({ x: 300, y: 400 });
const nextStep = () => {
  active.value = (active.value + 1) % 3;
};

/* pc端 */
const active = ref(0);
</script>

<style scoped>
.models-body {
  width: 70vw;
  margin: 2vh auto;
}

.step {
  margin: 10px auto 0;
}

.newModel {
  height: 76vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.step-item {
  cursor: pointer;
}

:deep(.el-card__header) {
  padding-top: 5px;
}

:deep(.el-breadcrumb__inner:hover) {
  color: var(--theme-lightColor);
}
</style>
