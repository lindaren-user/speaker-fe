<template>
  <RouterView />
</template>

<script setup>
import { _isMobile } from '@/utils/isMobile';

const isMobile = computed(() => _isMobile());
const active = ref(0);
</script>

<style scoped></style>
