import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  
import AOS from 'aos'
import 'aos/dist/aos.css'
import VueLazyload from 'vue-lazyload'

const app = createApp(App); 
app.use(router);         
app.mount('#app');       
AOS.init()
app.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})