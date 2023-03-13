<template>
    <div class="pb-container">
        <router-view/>
        <my-bottom></my-bottom>
    </div>
</template>
<script setup>
import myBottom from '@/views/myBottom.vue';
import { getCurrentInstance } from 'vue';
const $api = getCurrentInstance().appContext.config.globalProperties.$api;

</script>
<style scoped lang="scss">

</style>
