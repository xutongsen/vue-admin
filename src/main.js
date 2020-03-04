import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import VueCompositionApi from "@vue/composition-api";

import './permission' // permission control

import './icons' // icon

import 'normalize.css/normalize.css'
import '@/styles/main.scss' // global css

import "./plugins/element.js";

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

