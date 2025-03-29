<template>
  <div v-if="isMobile">
    <div class="ani">
      <h2 style="font-size: 1.875rem; color: #229453">Speaker灵眸智译</h2>
      <h3 style="font-size: 1.5625rem; color: #229453">欢迎来到灵眸智译智能传播平台</h3>

      <el-divider style="margin: 15px auto; width: 80%" />

      <h4 style="color: #248067">
        <i class="iconfont icon-shuyeu"></i><i class="iconfont icon-shuyeu"></i
        ><i class="iconfont icon-shuyeu"></i>让我们成为你的声音<i class="iconfont icon-shuyeu"></i
        ><i class="iconfont icon-shuyeu"></i><i class="iconfont icon-shuyeu"></i>
      </h4>
      <div style="text-align: right; margin: 30px 15px">
        <div>
          <a style="font-size: 1.5625rem; color: #41ae3c">100000000+</a
          ><a style="font-size: 18px; color: #d4c4b7">用户人数</a>
        </div>
        <div>
          <a style="font-size: 1.5625rem; color: #41ae3c">10000+</a
          ><a style="font-size: 18px; color: #d4c4b7">算法更迭</a>
        </div>
        <div>
          <a style="font-size: 1.5625rem; color: #41ae3c">100+</a
          ><a style="font-size: 18px; color: #d4c4b7">模型优化</a>
        </div>
      </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1097 1024" width="60vw">
      <HomeSvg />
    </svg>

    <div>
      <el-button type="success" style="margin-right: 80%" @click="router.push('/login')"
        ><el-icon><User /></el-icon>&nbsp;登录</el-button
      >
      <div style="height: 15px"></div>
      <el-button type="success" @click="router.push('/register')"
        ><el-icon><Check /></el-icon>&nbsp;注册</el-button
      >
    </div>
  </div>
  <div v-else class="contain">
    <div class="left ani">
      <h2 style="font-size: 3.625rem; color: #229453">Speaker灵眸智译</h2>
      <h3 style="font-size: 2.375rem; color: #229453">欢迎来到灵眸智译智能传播平台</h3>

      <el-divider style="margin: 1rem 3vw" />

      <h4 style="color: #248067; font-size: 1.5rem; margin-top: 1.25rem">
        <i class="iconfont icon-shuyeu"></i><i class="iconfont icon-shuyeu"></i
        ><i class="iconfont icon-shuyeu"></i>让我们成为你的声音<i class="iconfont icon-shuyeu"></i
        ><i class="iconfont icon-shuyeu"></i><i class="iconfont icon-shuyeu"></i>
      </h4>
      <div>
        <div class="kuaggle">
          <div class="kuaggle-body">
            <a class="number">100000000+</a><a class="char">用户人数</a>
          </div>
          <div class="kuaggle-body"><a class="number">10000+</a><a class="char">算法更迭</a></div>
          <div class="kuaggle-body"><a class="number">100+</a><a class="char">模型优化</a></div>
        </div>
      </div>
    </div>
    <div class="right">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1097 1024" width="95%">
        <HomeSvg />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { _isMobile } from '@/utils/isMobile';
import HomeSvg from '@/components/Svgs/HomeSvg.vue';

const isMobile = computed(() => _isMobile());
const router = useRouter();
</script>

<style scoped>
.contain {
  display: flex;
}
.right {
  flex: 5;
}
.left {
  display: flex;
  flex-direction: column;
  flex: 5;
}
.kuaggle-body {
  width: 50%;
  padding-top: 2%;
  margin-left: 12vw;
}
.number {
  font-size: 2.1875rem;
  color: #41ae3c;
}
.char {
  font-size: 1.5625rem;
  color: #d4c4b7;
}
@keyframes txx {
  from {
    opacity: 0;
  }
  to {
    opacity: 100%;
  }
}
.ani {
  transition: all 1s;
  animation: txx 1s;
  text-align: center;
  margin-top: 1.25rem;
}
.kuaggle {
  text-align: left;
  margin-top: 15vh;
}
</style>
