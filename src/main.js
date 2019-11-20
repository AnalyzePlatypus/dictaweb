import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import installSentry from "@/installers/installSentry.js";
import installCryptoQR from "@/installers/installCryptoQR.js";
import installJsPDF from "@/installers/installJsPDF.js";
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

if(process.env.NODE_ENV === "production") installSentry();
installCryptoQR();
installJsPDF();
