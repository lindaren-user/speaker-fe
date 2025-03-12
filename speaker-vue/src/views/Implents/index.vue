<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="el-aside">
        <el-menu class="el-menu-vertical-demo" :router="true" :default-active="activeIndex">
          <el-menu-item index="/implents/dataset">
            <div style="margin: 0 auto">
              <el-icon><Coin /></el-icon>
              <span>数据采集</span>
            </div>
          </el-menu-item>
          <el-menu-item index="/implents/tag">
            <div style="margin: 0 auto">
              <el-icon><CollectionTag /></el-icon>
              <span>数据标注</span>
            </div>
          </el-menu-item>
          <el-menu-item index="/implents/infer">
            <div style="margin: 0 auto">
              <el-icon><DataAnalysis /></el-icon>
              <span>模型训练</span>
            </div>
          </el-menu-item>
          <el-menu-item index="/implents/share">
            <div style="margin: 0 auto">
              <el-icon><Link /></el-icon>
              <span>分享</span>
            </div>
          </el-menu-item>
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
  height: 100vh;
  overflow: auto;
}

.el-menu--vertical .el-menu-item.is-active {
  color: #66c18c;
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
</style>
