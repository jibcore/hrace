import Vue from "vue";

import App from "./App.vue";
import store from "./stores";
import "./styles/main.css";

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
