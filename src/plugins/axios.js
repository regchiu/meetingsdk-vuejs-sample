import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_ENDPOINT

Vue.prototype.$axios = axios

export default axios
