<template>
  <div v-if="isMobile">
    <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="options" />
    </van-dropdown-menu>
    <div style="margin-top: 2vh">
      <Sign2Text v-if="value === 0" />
      <Text2Sign v-else />
    </div>
  </div>

  <div v-else>
    <Sign2Text v-if="routeId === '1'" />
    <Text2Sign v-else />
  </div>
</template>

<script setup>
import Sign2Text from '@/components/Interpretations/Sign2Text.vue';
import Text2Sign from '@/components/Interpretations/Text2Sign.vue';
import { useYiyuStore } from '@/stores/yiyu';
import { _isMobile } from '@/utils/isMobile';

const route = useRoute();
const isMobile = computed(() => _isMobile());
const yiyuStore = useYiyuStore();

const value = ref(0);
const options = [
  { text: '手语→文本', value: 0 },
  { text: '文本→手语', value: 1 },
];

// 路由参数和激活状态
const routeId = ref('');

watchEffect(() => {
  routeId.value = route.params.id;
});

watch(value, () => {
  if (isMobile.value && yiyuStore.isSuccess) yiyuStore.clearYiyu();
});
</script>

<style scoped></style>
