<template>
  <div class="layout-container">
    <el-container>
      <el-aside class="el-aside">
        <el-menu class="el-menu-vertical-demo" :router="true" :default-active="activeIndex">
          <el-menu-item index="/implents/myModels">
            <div style="margin: 0 7%">
              <el-icon><Coin /></el-icon>
              <span>我的模型</span>
            </div>
          </el-menu-item>
          <el-sub-menu index="/implents/models">
            <template #title>
              <div style="margin: 0 7%">
                <el-icon><Connection /></el-icon>
                <span style="font-size: 18px">创建模型</span>
              </div>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/implents/models/dataset"
                ><el-icon><Coin /></el-icon>数据采集</el-menu-item
              >
              <el-menu-item index="/implents/models/tag"
                ><el-icon><CollectionTag /></el-icon>语料定义</el-menu-item
              >
              <el-menu-item index="/implents/models/infer"
                ><el-icon><DataAnalysis /></el-icon>模型训练</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="/implents/interpretation">
            <template #title>
              <div style="margin: 0 auto">
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
      </el-aside>

      <el-main class="el-main">
        <RouterView />
      </el-main>
    </el-container>
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
  height: 100vh;
  display: flex;
}

.el-aside {
  position: fixed;
  left: 0;
  top: 100px;
  width: 12vw;
  background-color: white;
  z-index: 1000;
  margin-top: 20px;
}

.el-main {
  margin-left: 12vw; /* 让主内容从侧边栏右侧开始 */
  padding: 0;
  height: 83vh;
  overflow: auto;
  margin-top: -5vh;
}

.el-menu--vertical .el-menu-item.is-active {
  color: #66c18c;
  background-color: rgb(242, 244, 243);
}

.center {
  font-size: 20px;
  font-weight: bold;
}

:deep(.el-menu-item) {
  font-size: 18px;
  text-align: center;
}

:deep(.el-menu-item:hover) {
  color: lightgreen;
  background-color: rgb(242, 244, 243);
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}
</style>
