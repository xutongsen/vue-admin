import axios from 'ts-axios-learn'
import { Message } from "element-ui";
import { caching, STORAGE_LOCAL, TYPE_STR } from "../variable/common"
import { getStorage } from "./app"


const BASEURL = process.env.NODE_ENV === 'production' ? '' : '';
const service = axios.create({
    baseURL: BASEURL,  
    timeout: 15000,
});


/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(function (config) {
  

    config.headers['Tokey'] = getStorage(caching.Token, STORAGE_LOCAL , TYPE_STR )
    config.headers['UserName'] = getStorage(caching , STORAGE_LOCAL , TYPE_STR )

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
    let data = response.data
  
    if(data.code !== 0) {
        Message.error(data.message);
        return Promise.reject(data);
    }else{
        return response;
        // return Promise.resolve(data);
    }

}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;