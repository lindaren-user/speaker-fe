<template>
  <div v-if="isMobile">
    <van-nav-bar title="登录" left-arrow @click-left="router.push('/')" />
    <div style="margin-top: 20px"></div>
    <van-form @submit="login">
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
      </van-cell-group>
      <div style="margin-left: 200px">
        <RouterLink :to="{ path: '/register' }">
          <span style="color: red">还没账号？前往注册</span>
        </RouterLink>
      </div>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="success"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>

  <div v-else class="container">
    <div class="index-box">
      <h2 class="title">登录</h2>
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

        <el-button
          @click="login"
          type="primary"
          class="submit-button button"
          :loading="loading"
          :disabled="loading"
        >
          确定
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { _isMobile } from '@/utils/mobile/isMobile';
import { SuccessMessage, ErrorMessage } from '@/utils/others/messageTool';
import { user_service } from '@/apis/user_service';

/* 公共变量 */
const router = useRouter();
const userStore = useUserStore();

const formRef = ref(null);

const form = ref({
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

/* 移动端 */
const isMobile = computed(() => _isMobile());
const loading = ref(false);

/* 函数 */
const validateForm = () => {
  if (!form.value.username || !form.value.password) {
    ErrorMessage('请输入账号和密码');
    return false;
  }
  if (!rules.username[1].pattern.test(form.value.username)) {
    ErrorMessage(rules.username[1].message);
    return false;
  }
  if (!rules.password[1].pattern.test(form.value.password)) {
    ErrorMessage(rules.password[1].message);
    return false;
  }
  return true;
};

const loginRequest = () => {
  loading.value = true; // 开始加载
  user_service
    .login(form.value)
    .then((res) => {
      if (res.code === '200') {
        SuccessMessage('登录成功');
        userStore.changeUser(form.value.username);
        router.replace('/implents/models/myModels');
      } else {
        ErrorMessage(res.msg);
      }
    })
    .catch((err) => {
      console.error(err);
      ErrorMessage(err.message || '登录失败，请重试');
    })
    .finally(() => {
      loading.value = false; // 结束加载
    });
};

const login = () => {
  if (isMobile.value) {
    if (validateForm()) {
      loginRequest();
    }
  } else {
    formRef.value?.validate((valid) => {
      if (valid) {
        loginRequest();
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
  width: 25rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px) brightness(102%);
  box-shadow: 0 0.5rem 2rem 0 rgba(31, 38, 135, 0.37);
  border-radius: 1.25rem;
  padding: 1.875rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 3.125rem;
}

.el-form-item__label {
  font-size: 1rem;
  color: #555;
}

.el-input {
  border-radius: 0.5rem;
  transition: border-color 0.3s ease;
  width: 80%;
  margin: auto;
}

.el-input:hover {
  border-color: #409eff;
}

.submit-button {
  width: 50%;
  height: 2.5rem;
  font-size: 1.125rem;
  border-radius: 0.5rem;
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
  margin-left: 1.875rem;
}
</style>
