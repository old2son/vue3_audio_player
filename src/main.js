import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
// import '@/styles/style.scss'; // 打包时会自动生成 css 文件, 不会在 html中生成 style 标签, 但没sourceMap。
console.log('import.meta.env::', import.meta.env) // env 目录变量

const app = createApp(App);
app.use(router);
app.mount('#app');
app.config.globalProperties.$api = import.meta.env.VITE_TESTMOCKURL;
document.documentElement.style.fontSize = document.body.clientWidth / 30 + 'px';