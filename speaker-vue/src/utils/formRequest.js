import axios from 'axios';

const formRequest = axios.create({
  // timeout: 10000,
});

formRequest.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'; // 确保可以上传文件或表单数据。
    return config;
  },
  (error) => Promise.reject(error),
);

formRequest.interceptors.response.use(
  (response) => {
    let res = response.data;
    if (response.config.responseType === 'blob') {
      return res;
    }
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res;
    }
    return res;
  },
  (error) => Promise.reject(error),
);

export default formRequest;
