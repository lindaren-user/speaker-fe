<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/implents/models/myModels' }">我的模型</el-breadcrumb-item>
    <el-breadcrumb-item
      ><span style="font-size: 1.2rem">{{
        processedModelStore.processedModel.name
      }}</span></el-breadcrumb-item
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
    <keep-alive
      ><DataSet v-if="active === 0" />
      <Tag v-else-if="active === 1" />
      <Infer v-else
    /></keep-alive>
  </el-card>
</template>

<script setup>
import { useProcessedModelStore } from '@/stores/processedModel';
import DataSet from '@/components/Models/DataSet.vue';
import Tag from '@/components/Models/Tag.vue';
import Infer from '@/components/Models/Infer.vue';

const active = ref(0);
const processedModelStore = useProcessedModelStore();
</script>

<style scoped>
.models-body {
  width: 70vw;
  margin: 2vh auto;
}

.step {
  margin: 10px auto 0;
}

.step-item {
  cursor: pointer;
}
:deep(.el-card__header) {
  padding-top: 5px;
}
:deep(.el-breadcrumb__inner:hover) {
  color: #66c18c;
}
</style>
