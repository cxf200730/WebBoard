const webpack = require('webpack')

module.exports = {
  publicPath: './',
   lintOnSave: false, //是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://192.168.51.198:3000',
        changeOrigin: true
      }
    }
  }
}
