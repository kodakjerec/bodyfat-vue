import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia, { storeSettings } from "./store";
import "./assets/tailwind.css";
import "@icon-park/vue-next/styles/index.css";
import "highlight.js/styles/dark.css";

const app = createApp(App);

// google login
import vue3GoogleLogin from "vue3-google-login";
// sweet alert
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// intro.js
import introJS from "intro.js";
import "intro.js/introjs.css";
app.provide("intro", introJS());
// i18n
import i18n from "./libs/i18n";
// 消除背景警告
import "default-passive-events";
// crypto-js
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
const gDriveId: string =
  "U2FsdGVkX1+2Iq6bBSeV4JvO21Mhx8R/u1/EDscLTJcBt6eC85VnMxtIIFTaDyZ8Xa949jy7zxa1taMwSrTdp8PidCTcDSvtUNM5SF/jleEF69ioXo3K6zAmtGc2SW4t";
const realId: string = AES.decrypt(gDriveId, "kodak19890604").toString(encUtf8);

app
  .use(router)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: realId,
  })
  .use(VueSweetalert2)
  .use(i18n)
  .mount("#app");
