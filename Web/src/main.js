import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/socket'
import VueKonva from 'vue-konva'
import axios from 'axios'
import $ from "jquery"
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$ = $
Vue.use(ElementUI)
Vue.use(VueKonva)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
