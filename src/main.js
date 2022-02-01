import Vue from "vue";
import App from "./App.vue";
import "@/utility/directives.js";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
