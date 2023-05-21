import Vue from 'vue'
import VueAxios from 'vue-axios'
import { plainAxiosInstance, filesAxiosInstance } from '@/modules/axios'

Vue.config.productionTip = false

// Vue.prototype.$http = axios
Vue.use(VueAxios, {
  plain: plainAxiosInstance,
  files: filesAxiosInstance
})
