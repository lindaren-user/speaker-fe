<template>
  <div v-if="isMobile">
    <van-nav-bar title="注册" left-arrow @click-left="router.push('/')" />
    <div style="margin-top: 20px"></div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="账号"
          label="账号"
          placeholder="账号"
          :rules="rules.username"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="rules.password"
        />
        <van-field
          v-model="form.secondPwd"
          type="password"
          name="再次输入"
          label="再次输入"
          placeholder="再次输入密码"
          :rules="rules.secondPwd"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="success" native-type="submit"> 注册 </van-button>
      </div>
    </van-form>
  </div>

  <div v-else class="container">
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
        <el-button @click="onSubmit" type="primary" class="submit-button button">确定</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { user_service } from '@/apis/user_service';
import { _isMobile } from '@/utils/isMobile';
import { SuccessMessage, ErrorMessage } from '@/utils/messageTool';

// 判断是否为移动端
const isMobile = computed(() => _isMobile());

// 路由实例
const router = useRouter();

// 表单数据和验证规则
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
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { pattern: /^\w{11,15}$/, message: '请输入 11 - 15 位', trigger: 'blur' },
  ],
};

// 表单引用（用于 PC 端验证）
const formRef = ref(null);

// 表单验证逻辑
const validateForm = () => {
  if (form.value.password !== form.value.secondPwd) {
    ErrorMessage('前后两次密码不一致');
    return false;
  }
  return true;
};

// 注册逻辑
const register = () => {
  user_service
    .register({
      username: form.value.username,
      password: form.value.password,
    })
    .then((res) => {
      if (res.code === '200') {
        SuccessMessage('注册成功');
        router.replace('/login');
      } else {
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.error(err);
      ErrorMessage(err.message);
    });
};

// 提交表单
const onSubmit = () => {
  if (isMobile.value) {
    if (validateForm()) {
      register();
    }
  } else {
    formRef.value?.validate((valid) => {
      if (valid && validateForm()) {
        register();
      }
    });
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
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
  display: block;
  margin: 0 auto;
  margin-top: 20px;
}

:deep(.el-form-item__error) {
  margin-left: 30px;
}
</style>
