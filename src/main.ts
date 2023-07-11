import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import "./assets/tailwind.css";
import "@icon-park/vue-next/styles/index.css";
import "highlight.js/styles/dark.css";

import vue3GoogleLogin from "vue3-google-login";
import { gDriveId } from "./libs/gDrive";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import 'default-passive-events';

const app = createApp(App);

app
  .use(router)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: gDriveId,
  })
  .use(VueSweetalert2)
  .mount("#app");
