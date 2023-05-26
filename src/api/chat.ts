import http from '@/utils/http'
//
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let request = "/testIp/"

export function getChatEntryAPI (params:any) {
    return http.get(`${request}/GetChatEntryServlet?uId=${params}`)
}

export function getChatItemAPI (params:any) {
    return http.get(`${request}/GetChatItemServlet?cId=${params}`)
}

export function fetchAnswerAPI(params: any) {
    return http.post(`${request}/SendMessageServlet`, params)
}

export function cancelChatAPI(params: any) {
    return http.post(`${request}/CancelChatServlet`, params)
}

export function retriveChatAPI () {
    return http.get(`${request}/RetriveMsgServlet`)
}
