<template>
  <div class="body">
    <Sign2Text v-if="routeId == 1" />
    <Text2Sign v-else />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Sign2Text from '@/components/Interpretations/Sign2Text.vue';
import Text2Sign from '@/components/Interpretations/Text2Sign.vue';

const routeId = ref('');
const route = useRoute();

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

@media screen and (max-width: 400px) {
  .body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
</style>
