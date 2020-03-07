import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import VueCompositionApi from "@vue/composition-api";
import Cookies from 'js-cookie'

import './permission' // 权限路由

import './icons' // icon

import 'normalize.css/normalize.css'

// 按需加载 感觉都用element ui 了 按需加载就有点累赘
// import "./plugins/element.js";


import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

// 内部提供的size
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})
Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

