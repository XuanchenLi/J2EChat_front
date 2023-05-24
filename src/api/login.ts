import http from '@/utils/http'
//
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let request = "/testIp/"

export function loginAPI (data:any) {
    return http.post(`${request}/LoginServlet`, data)
}

export function registerAPI (params:any) {
    console.log(params)
    // let param = new URLSearchParams();
    // for (let i in params) {
    //     param.append(i, params[i])
    // }

    return http.post(`${request}/RegisterServlet`, params)
}

export function logoutAPI() {
    return http.get(`${request}/user/logout`)
}

export function forgetAPI(params:any) {
    return http.post(`${request}/ForgetServlet`, params)
}

export function updateUserAPI(params: any) {
    return http.post(`${request}/UpdateUserServlet`, params)
}
