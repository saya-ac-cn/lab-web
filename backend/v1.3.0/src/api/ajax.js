/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import axios from 'axios'
import {refreshTokenApi} from '@/api'
import storageUtils from '@/utils/storageUtils'
import jwt_decode from "jwt-decode";
import {openNotificationWithIcon} from "@/utils/window";

/**
 * 状态码设置
 **/
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

// 刷新token
const doRefreshToken = () => {
    return new Promise((resolve, reject) => {
        // 当前缓存中的token
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        if(access_token){
            // 解码jwt
            let token = jwt_decode(access_token)
            // 抓取jwt创建时间
            const exp = token.exp
            const current = parseInt(new Date().valueOf()/1000)
            const distant = current - exp
            // 若是local storage 中有值，
            // 1、如果已经过期（token创建时间已经过了30分钟），则直接清除所有的缓存，并重定向到登录页面
            // 2、如果邻近过期（token创建时间已经过了25分钟，但是小于30分钟），则刷新一次
            // 3、其它情况（token创建时间已经过的时间不足25分钟）
            if (distant > 1800){
                openNotificationWithIcon("error", "错误提示", '您已经长时间未操作，请重新登录！');
                storageUtils.removeAll();
                window.location.href = "/";
                reject('您已经长时间未操作，请重新登录！')
            }else if (distant > 1500){
                axios.post(refreshTokenApi, {}, { headers: { 'access_token':access_token} }
                ).then(response => {
                    storageUtils.add(storageUtils.ACCESS_KEY,response.data.data)
                    access_token = response.data.data
                    resolve(access_token)
                },error => {
                    const { response: { status, statusText, data: { msg = '服务器发生错误' } }} = error;
                    const text = codeMessage[status] || statusText || msg;
                    if (status === 401) {
                        storageUtils.removeAll();
                        window.location.href = "/";
                        openNotificationWithIcon("error", "错误提示", '您已经长时间未操作，请重新登录！');
                    }else{
                        openNotificationWithIcon("error", "错误提示", text);
                    }
                    reject('您已经离线！')
                }).catch(error => {
                    openNotificationWithIcon("error", "请求出错了", error.message);
                    reject(error)
                });
            }else{
                // 空转，不用刷新
            }
        }
        resolve(access_token)
    })
}

const doAjax = (access_token,url, data = {}, type = 'GET') => {
    return new Promise( (resolve, reject) => {
        let promise;
        let headers = {}
        if (access_token) {
            headers = {'access_token': access_token}
        }
        // 1. 执行异步ajax请求
        if (type === 'GET') { // 发GET请求
            promise = axios.get(url, { // 配置对象
                headers,
                params:data // 指定请求参数
            })
        } else if (type === 'DELETE') { // 发DELETE请求
            promise = axios.delete(url, { // 配置对象
                headers,
                params: data // 指定请求参数
            })
        } else if (type === 'PUT') { // 发PUT请求
            promise = axios.put(url, data, {headers})
        } else { // 发POST请求
            promise = axios.post(url, data, {headers})
        }
        // 2. 如果成功(200)了, 调用resolve(value)
        promise.then(response => {
            resolve(response.data);
            // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
        }, error => {
            if (error === undefined || error.code === 'ECONNABORTED') {
                openNotificationWithIcon("error", "请求出错了", '服务请求超时');
            }
            const {response: {status, statusText, data: {msg = '服务器发生错误'}}} = error;
            //const { response } = error
            const text = codeMessage[status] || statusText || msg;
            if (status === 401) {
                // 未登录
                openNotificationWithIcon("error", "错误提示", '您已经长时间未操作，请重新登录！');
                storageUtils.removeAll();
                window.location.href = "/";
            } else {
                openNotificationWithIcon("error", "请求出错了", text);
            }
            reject(text)
        }).catch(error => {
            openNotificationWithIcon("error", "请求出错了", error.message);
            reject(error)
        })
    })
}

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise( async (resolve, reject) => {
        // 判断是否需要刷新token，
        const access_token = await doRefreshToken()
        //console.log('access_token',access_token)
        const result = await doAjax(access_token,url, data, type)
        //console.log('bb', bb)
        resolve(result)
    });
}