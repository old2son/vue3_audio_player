import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
// import '@/styles/style.scss';

const app = createApp(App);
app.use(router);
app.mount('#app');

document.documentElement.style.fontSize = document.body.clientWidth / 30 + 'px';