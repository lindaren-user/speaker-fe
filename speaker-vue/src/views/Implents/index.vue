<template>
    <div class="layout-container">
      <el-container style="height: 80vh">
        <el-aside width="20vw">
          <el-col :span="18">
            <h5 class="mb-2">应用栏</h5>
            <el-menu
              class="el-menu-vertical-demo"
              :router="true"
              :default-active="activeIndex"
            >
              <el-menu-item index="/implents/dataset">
                <el-icon><i class="iconfont icon-shujuku"></i></el-icon>
                <span>数据采集</span>
              </el-menu-item>
              <el-menu-item index="/implents/tag">
                <el-icon><i class="iconfont icon-tuili"/></el-icon>
                <span>数据标注</span>
              </el-menu-item>
              <el-menu-item index="/implents/infer">
                <el-icon><i class="iconfont icon-moxingxunlian"/></el-icon>
                <span>模型训练</span>
              </el-menu-item>
              <el-menu-item index="/implents/share">
                <el-icon><i class="iconfont icon-fenxiang"/></el-icon>
                <span>分享</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main style="padding: 0; height: 80vh;">
          <RouterView/>
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
  
  /* 可选：自定义高亮颜色 */
  .el-menu--vertical .el-menu-item.is-active {
    color: #409eff;
  }
  </style>