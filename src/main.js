import Vue from 'vue'
import router from './router.js'
import App from './App.vue'
import '@/plugins/axios.js'
import '@/plugins/cookies.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
