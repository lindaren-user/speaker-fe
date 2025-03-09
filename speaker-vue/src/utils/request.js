import axios from "axios";
const request = axios.create({
    timeout: 5000,
})

// 请求拦截器
// 设置 Content-Type: application/json;charset=UTF-8，确保提交的是JSON 数据。
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return config;
},error=>{
    return Promise.reject(error);
})

// 响应拦截器
// 解析 blob（适用于文件下载）。
// 如果响应是字符串，尝试 JSON.parse 解析。
request.interceptors.response.use(response=>{
    let res = response.data;
    if(response.config.responseType==='blob'){
        return res;
    }
    if(typeof res==='string'){
        res=res?JSON.parse(res):res;
    }
    return res;
},error=>{
    return Promise.reject(error);
})

export default request;