<template>
  <div class="layout-container">
    <span class="menu">
      <el-menu :router="true" :default-active="activeIndex">
        <el-menu-item index="/implents/models">
          <div style="margin: 0 7%">
            <el-icon><Coin /></el-icon>
            <span>模型</span>
          </div>
        </el-menu-item>

        <el-sub-menu index="/implents/interpretation">
          <template #title>
            <div style="margin: 0 7%">
              <el-icon><Connection /></el-icon>
              <span style="font-size: 18px">翻译</span>
            </div>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/implents/interpretation/1">手语→文本</el-menu-item>
            <el-menu-item index="/implents/interpretation/2">文本→手语</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </span>

    <div class="models-body"><router-view></router-view></div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const activeIndex = ref('/implents/dataset');
const route = useRoute();

watchEffect(() => {
  activeIndex.value = route.path;
});
</script>

<style scoped>
.layout-container {
  display: flex;
}

.menu {
  width: 160px;
}

.el-menu--vertical .el-menu-item.is-active {
  color: #66c18c;
  background-color: rgb(242, 244, 243);
}

.models-body {
  margin: auto;
  height: auto;
}

:deep(.el-menu-item) {
  font-size: 1.125rem;
  text-align: center;
}

:deep(.el-menu-item:hover) {
  color: lightgreen;
  background-color: rgb(242, 244, 243);
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}

@media screen and (max-width: 400px) {
  .menu {
    display: none;
  }
}
</style>
