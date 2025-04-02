<template>
  <div v-if="isMobile">
    <van-dropdown-menu class="menu">
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
import { useYiyuStore } from '@/stores/yiyu';
import { _isMobile } from '@/utils/mobile/isMobile';
import Sign2Text from '@/components/Interpretations/Sign2Text.vue';
import Text2Sign from '@/components/Interpretations/Text2Sign.vue';

/* 公共变量 */
const route = useRoute();

/* 移动端 */
const isMobile = computed(() => _isMobile());
const value = ref(0);
const options = [
  { text: '手语→文本', value: 0 },
  { text: '文本→手语', value: 1 },
];

const yiyuStore = useYiyuStore();

watch(value, () => {
  if (isMobile.value && yiyuStore.isSuccess) yiyuStore.clearYiyu();
});

/* pc端 */
const routeId = ref('');

watchEffect(() => {
  routeId.value = route.params.id;
});
</script>

<style scoped>
.menu {
  border-bottom: 1px solid lightgray;
  position: relative;
  z-index: 1001;
}
</style>
