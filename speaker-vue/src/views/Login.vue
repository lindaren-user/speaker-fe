<template>
  <div class="container">
    <div class="index-box">
      <h2 class="title">登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" size="large" style="margin-top: 30px">
        <el-form-item label="" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" class="input"></el-input>
        </el-form-item>

        <el-form-item label="" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            class="input"
          ></el-input>
        </el-form-item>

        <el-button @click="login" type="primary" class="submit-button button">确定</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import request from '@/utils/request';

const formRef = ref(null);
const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [
    { required: true, message: '请输入账户（长度为9 - 11）', trigger: 'blur' },
    { pattern: /^\w{9,11}$/, message: '请输入 9 - 11 位的数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码(长度为11 - 15)', trigger: 'blur' },
    { pattern: /^\w{11,15}$/, message: '请输入 11 - 15 位的数字', trigger: 'blur' },
  ],
};

const login = () => {
  userStore.changeUser('lindaren');

  formRef.value?.validate((valid) => {
    if (valid) {
      request
        .post('/api/login', toRaw(form))
        .then((res) => {
          if (res.code == 200) {
            ElMessage.success('登录成功');
            userStore.changeUser(form.username);
            router.replace('/implents/dataset');
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((err) => console.log(err));
    }
  });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20vh;
}

.index-box {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px) brightness(102%);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 20px;
  padding: 30px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 50px;
}

.el-form-item__label {
  font-size: 16px;
  color: #555;
}

.el-input {
  border-radius: 8px;
  transition: border-color 0.3s ease;
  width: 80%;
  margin: auto;
}

.el-input:hover {
  border-color: #409eff;
}

.submit-button {
  width: 50%;
  height: 40px;
  font-size: 18px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #3a8ee6;
}

.button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}

:deep(.el-form-item__error) {
  margin-left: 30px;
}
</style>
