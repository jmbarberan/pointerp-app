/* eslint-disable no-console */

import "./assets/css/vendor/dropzone.min.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
// Un solo color
//import "./assets/css/sass/themes/piaf.light.blueolympic.scss";
//import "./main";
import { register } from 'register-service-worker'

// Multicolor
import { getThemeColor } from "./utils";
var color = getThemeColor();
let render = () => {
  import("./assets/css/sass/themes/piaf." + color + ".scss").then(() => {
    require("./main");
  });
}
render();

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      /*console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )*/
    },
    registered () {
      //console.log('Service worker has been registered.')
    },
    cached () {
      //console.log('Content has been cached for offline use.')
    },
    updatefound () {
      //console.log('New content is downloading.')
    },
    updated () {
      //console.log('New content is available; please refresh.')
    },
    offline () {
      //console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
