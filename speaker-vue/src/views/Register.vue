<template>
    <div class="container">
      <div class="index-box">
        <h2 class="title">注册</h2>
        <el-form :model="form" :rules="rules" ref="formRef" size="large" style="margin-top: 50px;">
          <el-form-item label="账户" prop="username" trigger="blur">
            <el-input v-model="form.username" style="width: 80%" placeholder="请输入账号"></el-input>
          </el-form-item>
  
          <el-form-item label="密码" prop="password" trigger="blur">
            <el-input v-model="form.password" style="width: 80%" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
  
          <el-button @click="index" type="primary" class="submit-button button">确定</el-button>
        </el-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // 模拟Request对象
  const Request = {
    post(url, data) {
      return new Promise((resolve) => {
        // 模拟成功响应
        resolve({ code: 200, msg: '注册成功' });
      });
    },
  };
  
  // Reactive data using ref
  const form = ref({
    username: '',
    password: '',
  });
  
  // 表单引用
  const formRef = ref(null);
  
  // Validation rules
  const rules = {
    username: [
      { required: true, message: '请输入账户（长度为9 - 11）', trigger: 'blur' },
      { pattern: /^\w{9,11}$/, message: '请输入数字(长度为9 - 11)', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码(长度为11 - 15)', trigger: 'blur' },
      { pattern: /^\w{11,15}$/, message: '请输入数字(长度为11 - 15)', trigger: 'blur' },
    ],
  };
  
  // 获取路由实例
  const router = useRouter();
  
  // Form validation and submission method
  const index = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        Request.post('/api/login', form.value).then((res) => {
          if (res.code === 200) {
            ElMessage.success('注册成功');
            router.push('/index');
          } else {
            ElMessage.error(res.msg);
          }
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
    margin-top: 10vh;
  }
  
  .index-box {
    width: 400px; /* 固定宽度 */
    height: auto; /* 高度自适应 */
    background-color: rgba(255, 255, 255, 0.8); /* 增加背景透明度 */
    backdrop-filter: blur(10px) brightness(102%);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* 更柔和的阴影 */
    border-radius: 20px; /* 更大的圆角 */
    padding: 40px; /* 增加内边距 */
    animation: fadeIn 0.5s ease-out; /* 添加淡入动画 */
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
    margin-bottom: 20px;
  }
  
  .el-form-item__label {
    font-size: 16px;
    color: #555;
  }
  
  .el-input {
    border-radius: 8px; /* 输入框圆角 */
    transition: border-color 0.3s ease; /* 输入框边框颜色过渡效果 */
  }
  
  .el-input:hover {
    border-color: #409eff; /* 输入框悬停时边框颜色 */
  }
  
  .submit-button {
    width: 50%;
    height: 40px;
    font-size: 18px;
    border-radius: 8px; /* 按钮圆角 */
    transition: background-color 0.3s ease; /* 按钮背景颜色过渡效果 */
  }
  
  .submit-button:hover {
    background-color: #3a8ee6; /* 按钮悬停时背景颜色 */
  }

  .button {
    display: block; /* 将按钮转换为块级元素 */
    margin: 0 auto; /* 水平居中 */
    margin-top: 20px; /* 添加顶部外边距，使其与表单元素有一定间距 */
  }
  </style>