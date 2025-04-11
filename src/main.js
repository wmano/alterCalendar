import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { faBars, faXmark, faArrowRight, faArrowLeft, faCross, faWineBottle, faCheese, faFish, faEgg} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faGooglePlay, faApple, faAppStoreIos } from "@fortawesome/free-brands-svg-icons";


import { createApp } from 'vue'
import App from './App.vue'

library.add(faBars, faInstagram, faXmark, faGooglePlay, faApple, faAppStoreIos, faArrowRight,
    faArrowLeft, faCross, faWineBottle, faCheese, faFish, faEgg)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
