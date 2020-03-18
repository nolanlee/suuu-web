import Vue from "vue";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "handsontable/dist/handsontable.full.css";

import App from "./App";
import router from "./router";

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  components: { App },
  router,
  template: "<App/>"
}).$mount("#app");
