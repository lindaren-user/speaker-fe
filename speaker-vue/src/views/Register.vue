<template>
  <div class="container">
    <div class="index-box">
      <h2 class="title">注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" size="large" style="margin-top: 30px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" class="input"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            class="input"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="secondPwd">
          <el-input
            v-model="form.secondPwd"
            placeholder="再次输入密码"
            show-password
            class="sInput"
          ></el-input>
        </el-form-item>

        <el-button @click="register" type="primary" class="submit-button button">确定</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';

const formRef = ref(null);
const router = useRouter();

const form = ref({
  username: '',
  password: '',
  secondPwd: '',
});

const rules = {
  username: [
    { required: true, message: '请输入账户（长度为9 - 11）', trigger: 'blur' },
    { pattern: /^\w{9,11}$/, message: '请输入 9 - 11 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码(长度为11 - 15)', trigger: 'blur' },
    { pattern: /^\w{11,15}$/, message: '请输入 11 - 15 位', trigger: 'blur' },
  ],
  secondPwd: [
    { required: true, message: '', trigger: 'blur' },
    { pattern: /^\w{11,15}$/, message: '请输入 11 - 15 位', trigger: 'blur' },
  ],
};

const register = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.value.password !== form.value.secondPwd) {
        ElMessage.error('前后两次密码不一致');
        return;
      }
      request
        .post('/api/register', {
          username: form.value.username,
          password: form.value.password,
        })
        .then((res) => {
          if (res.code == 200) {
            ElMessage({
              showClose: true,
              type: 'success',
              message: '注册成功',
            });
            router.replace('/login');
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error(err.message);
        });
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

.input {
  width: 80%;
  margin: auto;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.sInput {
  width: 88%;
  margin: 4px;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.input:hover {
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
  display: block; /* 将按钮转换为块级元素 */
  margin: 0 auto; /* 水平居中 */
  margin-top: 20px; /* 添加顶部外边距，使其与表单元素有一定间距 */
}

:deep(.el-form-item__error) {
  margin-left: 30px;
}
</style>
