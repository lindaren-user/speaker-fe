<template>
  <div v-if="isMobile">
    <van-tabs v-model:active="active">
      <van-tab title="标签 1">内容 1</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
    </van-tabs>
  </div>
  <div v-else class="body">
    <Sign2Text v-if="routeId === '1'" />
    <Text2Sign v-else />
  </div>
</template>

<script setup>
import Sign2Text from '@/components/Interpretations/Sign2Text.vue';
import Text2Sign from '@/components/Interpretations/Text2Sign.vue';
import { _isMobile } from '@/utils/isMobile';

const routeId = ref('');
const route = useRoute();
const isMobile = computed(() => _isMobile());

watchEffect(() => {
  routeId.value = route.params.id;
});
</script>

<style scoped>
.body {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 600px 600px;
  gap: 1.875rem;
}
</style>
