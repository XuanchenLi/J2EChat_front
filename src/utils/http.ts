/****   http.js   ****/
// 导入封装好的axios实例
import request from './request'

const http ={
    /**
     * methods: 请求
     * @param url 请求地址
     * @param params 请求参数
     * https://juejin.cn/post/7100814332685975588#heading-6
     * https://blog.csdn.net/GeniusXYT/article/details/104402757
     */
    get(url:string){
        const config = {
            method: 'get',
            url:url,
        }
        return request(config)
    },
    post(url:string,params:any){
        const config = {
            method: 'post',
            url:url,
            data: ""
        }
        if(params) config.data = params
        return request(config)
    },
    put(url:string,params:any){
        const config = {
            method: 'put',
            url:url,
            params: ""
        }
        if(params) config.params = params
        return request(config)
    },
    delete(url:string,params:any){
        const config = {
            method: 'delete',
            url:url,
            params: ""
        }
        if(params) config.params = params
        return request(config)
    }
}
//导出
export default http

