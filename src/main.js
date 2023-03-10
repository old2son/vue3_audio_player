import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
// import '@/styles/style.scss';
console.log('import.meta.env::', import.meta.env) // env 目录变量

const app = createApp(App);
app.use(router);
app.mount('#app');

document.documentElement.style.fontSize = document.body.clientWidth / 30 + 'px';