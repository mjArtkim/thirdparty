import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App); 
app.use(router);         
app.mount('#app');       
AOS.init()
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('app-loader')
  if (loader) loader.remove()
})