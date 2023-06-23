import {
    createApp
} from 'vue'
import './index.css'
import App from './App.vue'
import router from './router/index'

import {
    library
} from "@fortawesome/fontawesome-svg-core";
import {
    faDrawPolygon
} from "@fortawesome/free-solid-svg-icons";
import {
    faBezierCurve
} from "@fortawesome/free-solid-svg-icons";
import {
    faLocationPin
} from "@fortawesome/free-solid-svg-icons";
import {
    faRightLeft
} from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";

library.add(faDrawPolygon, faBezierCurve, faLocationPin, faRightLeft);

createApp(App).use(router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')