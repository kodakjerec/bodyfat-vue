import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import "./assets/tailwind.css";
import "@icon-park/vue-next/styles/index.css";
import "highlight.js/styles/dark.css";

const app = createApp(App);

// google login
import vue3GoogleLogin from "vue3-google-login";
import { gDriveId } from "./libs/gDrive";
// sweet alert
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// intro.js
import introJS from "intro.js";
import "intro.js/introjs.css";
app.provide('intro', introJS());

import 'default-passive-events';

app
  .use(router)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: gDriveId,
  })
  .use(VueSweetalert2)
  .mount("#app");
