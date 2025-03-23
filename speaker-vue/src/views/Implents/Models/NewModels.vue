<template>
  <div class="modelName">
    <span>当前模型为"{{ processedModelStore.processedModel.name }}"</span>
  </div>
  <el-card class="models-body">
    <template #header
      ><div class="step">
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
import { ref } from 'vue';
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
  margin: 0 auto;
}

.modelName {
  display: flex;
  justify-content: center;
}

.step {
  width: 70vw;
  margin: 0 auto;
}

.step-item {
  cursor: pointer;
}
</style>
