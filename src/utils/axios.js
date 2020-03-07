import axios from 'ts-axios-learn'
import { Message, MessageBox } from "element-ui";
import store from '@/store'
import { getToken } from "./app"

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,   
    timeout: 15000,
});


/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(function (config) {
  

    if (store.getters.token) {
        config.headers['X-Token'] = getToken()
    }

    return config;
}, function (error) {
// 对请求错误做些什么
    return Promise.reject(error);
});


/**
 * 请求接口后，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let res = response.data
  
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
  
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm('您已注销，可以取消停留在此页面上，或者再次登录', '确认登出', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }

}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;