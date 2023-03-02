import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
const home = ()=> import('@/views/Home.vue');
const search = ()=> import('@/views/Search.vue');
const radio = ()=> import('@/views/Radio.vue');

const routes = [
    { 
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: home
    },
    {
        path: '/search',
        name: 'search',
        component: search
    },
    {
        path: '/radio',
        name: 'radio',
        component: radio
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    // history: createWebHistory(),
    routes
});

export default router;