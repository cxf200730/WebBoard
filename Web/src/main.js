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
import {saveAs} from 'file-saver'
import VueTouch from 'vue-touch'
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$ = $
Vue.use(ElementUI)
Vue.use(VueKonva)


Vue.use(VueTouch, {name: 'v-touch'})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
