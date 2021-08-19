const webpack = require('webpack')

module.exports = {
  publicPath: './',
  lintOnSave: false, //是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://192.168.51.104:3000',
        ws: true, //代理websockets
        changeOrigin: true, // 是否跨域，虚拟的站点需要更管origin
      }
    }
  },
  configureWebpack: {
    plugins: [
 
       new webpack.ProvidePlugin({
         $:"jquery",
 
         jQuery:"jquery",
 
         "windows.jQuery":"jquery"
 
       })
 
     ]
 
 }
}
