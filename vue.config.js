const { defineConfig } = require('@vue/cli-service')
//
//https://segmentfault.com/a/1190000038818149

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/',
  //publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    client: {
      overlay: true,
    },
    host: "localhost",
    port: 8090, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置后自动启动浏览器
    hot: "only",
    // hotOnly: true, // 热更新
    // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理

    proxy: { //配置多个代理
      "/testIp": {
        target: "http://localhost:8888/J2EChat",
        changeOrigin: true,
        ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/testIp": "/"
        },
        cookiePathRewrite: {
          '*': '/'
        },
        onProxyRes(proxyRes, req, res) {
          var oldCookie = proxyRes.headers['set-cookie']
          if (oldCookie == null || oldCookie.length == 0) {
            delete proxyRes.headers['set-cookie']
            return
          }

          var oldCookieItems = oldCookie[0].split(';')
          var newCookie = ''
          for(var i=0; i < oldCookieItems.length; ++i){
            if(newCookie.length >0)
              newCookie += ';'
            if(oldCookieItems[i].indexOf('Path=') >= 0)
              newCookie += 'Path=/'
            else
              newCookie += oldCookieItems[i]
          }
          proxyRes.headers['set-cookie'] = [newCookie]
        }
      }
      },


  }
})
