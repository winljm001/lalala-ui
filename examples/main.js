import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入组件库
import lalala from "./../packages/index";
// 注册组件库
Vue.use(lalala);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
