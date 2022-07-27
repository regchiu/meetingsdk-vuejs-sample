import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

export default router
