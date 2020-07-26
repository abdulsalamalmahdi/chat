import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./state"


import vuetify from '@/plugins/vuetify' // path to vuetify export


new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
