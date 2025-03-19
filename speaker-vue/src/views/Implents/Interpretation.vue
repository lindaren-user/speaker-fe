<template>
  <div class="body">
    <keep-alive>
      <Sign2Text v-if="routeId == 1" />
      <Text2Sign v-else />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Sign2Text from '@/components/Sign2Text.vue';
import Text2Sign from '@/components/Text2Sign.vue';

const routeId = ref('');
const route = useRoute();

watchEffect(() => {
  routeId.value = route.params.id;
});
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 95%;
  flex: 1;
  margin-top: 4vh;
}
</style>
